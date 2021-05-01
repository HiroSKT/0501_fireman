(function () {
    var var_KEYCODE = {keyLeft: 37, keyRight: 39};
    var var_keyValue = 0;
    var var_firemanRightLimit = 0;

    var varAudio = null;
    var varAudioPlayed = false;

    var var_canvas;
    var var_ctx;
    var var_image = {fire:null, fireman:null};
    var var_fire_x =0;
    var var_fire_y =0;
    var var_fireOriginalWidth = 0;
    var var_fireOriginalHeight = 0;
    var var_fireModifiedWidth = 50;
    var var_fireModifiedHeight = 50;
    var var_fireWidthRatio = 0;
    var var_fireHeightRatio = 0;
    var var_fireman_x = 0;
    var var_fireman_y = 0;
    var var_firemanOriginalWidth = 0;
    var var_firemanOriginalHeigth = 0;
    var var_firemanModifiedWidth = 100;
    var var_firemanModifiedHeight = 100;
    var var_firemanWidthRatio = 0;
    var var_firemanHeightRatio = 0;
    var var_requestID = 0;

    var var_speed = 5;

    //HTMLがロード完了したら，LoadAssets関数を実行するイベントハンドラー
    document.addEventListener('DOMContentLoaded', function () {
        var_speed = Math.random()*10;
        func_loadAssets();
        func_setHandlers();
    });

    function func_setHandlers() {
        document.addEventListener('keydown', function (event) {
            if (event.which == var_KEYCODE.keyLeft) {
                var_keyValue = -3;                
            } else if (event.which == var_KEYCODE.keyRight){
                var_keyValue = +3;
            }
        });
        document.addEventListener('keyup', function () {
            var_keyValue = 0;
        });
    }


    //画像を表示する関数
    function func_loadAssets() {
        var_canvas = document.getElementById('backg');
        var_canvas.addEventListener('click', function () {
            //レンダーのリクエストがない場合は，レンダーを実行。ある場合はすでに実行中なのでそのまま放置。
            if (!var_requestID){
                func_renderFrame();
            }
        });

        var_ctx = var_canvas.getContext('2d');
        //炎を画像を読み込んで，サイズと位置を調整して，キャンバスに描画する。
        
        varAudio = new Audio('kin.mp3'); //音声の読み込みも，画像の読み込みも大体一緒
        
        var_image.fire = new Image(); //newステートメントとImage関数で，新しいオブジェクトを定義する
        var_image.fire.src = 'fire.png';
        //画像のサイズを変更する方法は？→DrawImageメソッドの第四引数に幅，第五引数に高さを指定できる！
        //画像がロードされたら，キャンバスに描画する
        var_image.fire.onload = function (){
            var_fireOriginalWidth = var_image.fire.width;
            var_fireOriginalHeight = var_image.fire.heigth;
            var_fireWidthRatio = var_fireModifiedWidth / var_fireOriginalWidth;
            var_fireHeightRatio = var_fireModifiedHeight / var_fireOriginalHeight;
            // var_fire_x = func_getCenterPosition(var_canvas.clientWidth, var_image.fire.width * var_fireWidthRatio);
            var_fire_x = funcGetRandomInteger(0, var_canvas.width - var_fireModifiedWidth);
            var_fire_y = funcGetRandomInteger(-500, 0);
            
            var_firemanRightLimit = var_canvas.clientWidth - var_firemanModifiedWidth;

            var_ctx.drawImage(var_image.fire, var_fire_x, var_fire_y, var_fireModifiedWidth, var_fireModifiedHeight);
        };
        // 消防士の画像を読み込んで，サイズと位置を調整して，キャンバスに描画する。
        var_image.fireman = new Image();
        var_image.fireman.src = 'fireman.png';
        var_image.fireman.onload = function () {    
            var_firemanOriginalWidth = var_image.fireman.width;
            var_firemanOriginalHeigth = var_image.fireman.height;
            var_firemanWidthRatio = var_firemanModifiedWidth / var_firemanOriginalWidth;
            var_firemanHeightRatio = var_firemanModifiedHeight / var_firemanOriginalHeigth;     
            var_fireman_x = func_getCenterPosition(var_canvas.clientWidth, var_image.fireman.width * var_firemanWidthRatio);
            var_fireman_y = var_canvas.clientHeight - var_image.fireman.height * var_firemanHeightRatio;
            var_ctx.drawImage(var_image.fireman, var_fireman_x, var_fireman_y, var_firemanModifiedWidth, var_firemanModifiedHeight);
        };
    }

    function func_getCenterPosition(var_containerWidth, var_itemWidth) {
        return (var_containerWidth / 2) - (var_itemWidth / 2);        
    }

    function func_renderFrame() {
        if (var_fire_y > var_canvas.clientHeight) {
            var_fire_x = funcGetRandomInteger(0, var_canvas.width - var_fireModifiedWidth);
            var_fire_y = funcGetRandomInteger(-500, 0);
            
            
            //オーディオ再生のリセット
            varAudio.pause();
            varAudio.currentTime = 0;
            varAudioPlayed = false;
        }

        //前の残像が残らなにように，ClearRectメソッドで指定した四角形を塗りつぶす。今回はキャンバス全体をクリアしている
        var_ctx.clearRect(0, 0, var_canvas.width, var_canvas.height);
        //新しく描画する炎と消防士の画像
        var_fire_y += var_speed;

        if ((var_fireman_x < var_firemanRightLimit && var_keyValue > 0) || (var_fireman_x > 0 && var_keyValue < 0)) {
            var_fireman_x += var_keyValue; 
        }

        var_ctx.drawImage(var_image.fire, var_fire_x, var_fire_y, var_fireModifiedWidth, var_fireModifiedHeight);
        var_ctx.drawImage(var_image.fireman, var_fireman_x, var_fireman_y, var_firemanModifiedWidth, var_firemanModifiedHeight);
        
        if (funcIsHit(var_fire_x, var_fire_y, var_fireman_x, var_fireman_y)) {
            funcHitJob();
        }

        //アニメーションのループを実行させる
        var_requestID = window.requestAnimationFrame(func_renderFrame);
    }

    function funcIsHit(ax, ay, bx, by) {
        return (((ax <= bx && bx <= ax + var_fireModifiedWidth) || (bx <= ax && ax <= bx + var_firemanModifiedWidth)) && ((ay <= by && by <= ay + var_fireModifiedHeight) || (by <= ay && ay <= by + var_firemanModifiedHeight)));
    }
    
    function funcHitJob() {
        var_ctx.font = 'bold 50px sans-serif';
        var_ctx.fillStyle = 'red';
        var_ctx.fillText('消火完了!!', 50, 50);
    
        if (!varAudioPlayed) {
            varAudio.play();
            varAudioPlayed = true;
        }
    }

    function funcGetRandomInteger(varMin, varMax) {
        return Math.floor(Math.random() * (varMax - varMin + 1));       
    }


})();


