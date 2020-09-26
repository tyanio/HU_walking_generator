var img01 = new Image();
img01.src = "imgs/EPSON001.jpg";
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
        context.strokeRect(data[path[0]].x - 15, data[path[0]].y - 15, 30, 30)
        //パスの開始座標を指定する
        context.moveTo(data[path[0]].x, data[path[0]].y);
        //座標を指定してラインを引いていく
        for (var i = 1; i < path.length; i++) {
            context.lineTo(data[path[i]].x, data[path[i]].y);
            context.lineWidth = 10;
        }

        context.fillRect(data[path[path.length - 1]].x - 15, data[path[path.length - 1]].y - 15, 30, 30)

        //ラインの色を指定
        context.strokeStyle = '#ff69b4';

        context.stroke();
        $("#detail_comment").text("総行程 約" + Math.round(path.meter) + "m!")
    }
}

//200m -> ピクセル
const meter200toPixcel = 288
//8000歩 -> メートル
const po8000toMeter = 5760
//10分 -> メートル
const minutes10toMeter = 800

function pixcelOfMeter(meter) { return meter * (meter200toPixcel / 200) };
function pixcelOfMinutes(minutes) { return pixcelOfMeter(minutes * (minutes10toMeter / 10)) };
function pixcelOfPo(po) { return pixcelOfMeter(po * (po8000toMeter / 8000)) };
function meterOfPixcel(pixcel) { return pixcel * (200 / meter200toPixcel) };

function generate() {
    if (datasize == 0) {
        console.log("データを読み込めていません")
    }

    var targetMitinori = Infinity;
    if (targeted) {
        const targetElem = document.getElementById("target")
        if (targetElem.value == "target_distance") {
            const targetValue = document.getElementById("target_distance_value").value
            targetMitinori = pixcelOfMeter(Number(targetValue));
        } else if (targetElem.value == "target_time") {
            const targetValue = document.getElementById("target_time_value").value
            targetMitinori = pixcelOfMinutes(Number(targetValue));
        } else if (targetElem.value == "target_steps") {
            const targetValue = document.getElementById("target_steps_value").value
            targetMitinori = pixcelOfPo(Number(targetValue));
        }
    }
    console.log("目標 " + targetMitinori)

    const kouho = [];
    const sikou = ((!isFinite(targetMitinori)) ? 1 : 15);
    for (var tamesi = 0; tamesi < sikou; tamesi++) {
        // 結果格納変数
        var path = []
        var mitinori = 0

        // スタート地点
        var beginID = Math.floor(Math.random() * datasize) + 1;
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
            if (mitinori >= targetMitinori) break;

            //次ループ準備
            vertex = data[nextID];
            next = vertex.adjacent;
            prevID = nextID;
        }

        path.mitinori = mitinori;
        path.meter = meterOfPixcel(mitinori)
        kouho.push(path)
    }

    var bestpath = kouho[0];
    for (var i = 1; i < kouho.length; i++) {
        if (Math.abs(kouho[i].mitinori - targetMitinori) < Math.abs(bestpath.mitinori - targetMitinori)) {
            bestpath = kouho[i];
        }
    }
    console.log(bestpath)
    draw(bestpath)
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
                console.log("不正：" + i + " と " + adjacent[j] + " の間 " + ok)
            }
        }
    }
}

var targeted = false;
function clickSelectBtn() {
    const div1 = document.getElementById("target_distance_container");
    const div2 = document.getElementById("target_time_container");
    const div3 = document.getElementById("target_steps_container");
    if(targeted){
        targeted = false;
        div1.style.display = "none";
        div2.style.display = "none";
        div3.style.display = "none";
    }else{
        targeted = true;
        div1.style.display = "block";
        div2.style.display = "block";
        div3.style.display = "block";
    }

    // if (div.style.display == "block") {
    //     // noneで非表示
    //     targeted = false;
    // } else {
    //     // blockで表示
    //     targeted = true;
    // }
}
// $("#select_target_button").click(function(){
//     const str = $("#target").val();
//     if(str == "target_distance"){
//         $("#target_distance_container").toggle();
//     }
// });