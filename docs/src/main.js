var img01 = new Image();
img01.src = "imgs/saijyo_ja_2019-1.png";
function main() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    //ここに具体的な描画内容を指定する
    //新しいパスを開始する
    context.beginPath();
    //パスの開始座標を指定する
    context.moveTo(100, 20);
    //座標を指定してラインを引いていく
    // context.lineTo(150, 100);
    // context.lineTo(50, 100);
    //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
    context.closePath();
    //現在のパスを輪郭表示する
    context.drawImage(img01, 10, 10);
    context.stroke();


    $.getJSON("src/data.json", function (data) {
        console.log(data)
    });
}

// $(function() {
// });