var img01 = new Image();
img01.src = "imgs/saijyo_ja_2019-1.png";
// var data = null;
var datasize = 0;
function main() {
    datasize = Object.keys(data).length;
    document.getElementById("generate_button").onclick = function () {
        console.log("ジェネレート!")
        generate()
    };

    draw();
}


function draw(path = []) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    context.drawImage(img01, 0, 0);
    //ここに具体的な描画内容を指定する
    if (path.length > 0) {
        //新しいパスを開始する
        context.beginPath();
        //パスの開始座標を指定する
        context.moveTo(data[path[0]].x, data[path[0]].y);
        //座標を指定してラインを引いていく
        for (var i = 1; i < path.length; i++) {
            context.lineTo(data[path[i]].x, data[path[i]].y);
            context.lineWidth = 10;
        }

        //ラインの色を指定
        context.strokeStyle = '#ff69b4';

        context.stroke();
    }
}

//200m -> ピクセル
const meter200toPixcel = 288
//8000歩 -> メートル
const po8000toMeter = 5760
//10分 -> メートル
const minutes10toMeter = 800

function generate() {
    if (datasize == 0) {
        console.log("データを読み込めていません")
    }

    // 結果格納変数
    var path = []
    var mitinori = 0

    // スタート地点
    var beginID = Math.floor(Math.random() * datasize);
    path.push(beginID);

    // 到達管理
    var visited = {};
    visited[beginID] = true;

    //ループ変数
    var prevID = beginID;
    var vertex = data[beginID];
    var next = vertex.adjacent;
    while (true) {
        //行ける場所列挙
        const nextable = []
        for (var i = 0; i < next.length; i++) {
            if (!visited[next[i]]) {
                nextable.push(next[i])
            }
        }
        if (nextable.length == 0) break;

        //次点
        const nextID = nextable[Math.floor(Math.random() * nextable.length)];

        //追加
        path.push(nextID);
        visited[nextID] = true;
        mitinori += distanceBetween(prevID, nextID);

        //次ループ準備
        vertex = data[nextID];
        next = vertex.adjacent;
        prevID = nextID;
    }

    console.log(path)
    path.mitinori = mitinori;
    draw(path)
}

function distanceBetween(id1, id2) {
    const v1 = data[id1]
    const v2 = data[id2]
    return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y))
}

function assertData() {
    for (var i = 1; i <= datasize; i++) {
        const adjacent = data[i].adjacent;
        for (var j = 0; j < adjacent.length; j++) {
            var ok = 0;
            const adjacentadjacent = data[adjacent[j]].adjacent;
            for (var k = 0; k < adjacentadjacent.length; k++) {
                if (adjacentadjacent[k] == i) ok++;
            }
            if (ok != 1) {
                console.log("不正：" + i + " と " + adjacent[j] + " の間 "+ok)
            }
        }
    }
}