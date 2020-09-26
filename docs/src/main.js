var img01 = new Image();
img01.src = "imgs/saijyo_ja_2019-1.png";
var data = null;
var datasize = 0;
function main() {

    $.getJSON("src/data.json", function (d) {
        console.log(d)
        data = d;
        datasize = Object.keys(d).length;
    });

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
        }
        //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
        // context.closePath();
        context.stroke();
    }
}

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