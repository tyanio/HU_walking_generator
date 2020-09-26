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
    context.lineTo(319, 774);
    context.lineTo(1020, 633);
    //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
    // context.closePath();

    context.drawImage(img01, 0, 0);

    context.stroke();


    $.getJSON("src/data.json", function (data) {
        console.log(data)
    });
}

// $(function() {
// });