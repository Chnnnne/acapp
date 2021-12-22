//是这个基类的所有物体，每一帧都要画一次，每一秒种浏览器一般可以分为60帧，所以将被调用60次。
let AC_GAME_OBJECTS = [];//我们把所有基类是这个类的对象，都加进这个数组里，然后每一帧都渲染一遍这个数组

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        
        this.has_called_start = false;  // 是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔.因为不同浏览器的帧率不一定相同，因此我们用时间来衡量速度
    }

    start() {  // 只会在第一帧执行一次
    }

    update() {  // 每一帧均会执行一次
    }

    on_destroy() {  // 在被销毁前执行一次
    }

    destroy() {  // 删掉该物体, delete this object , js当一个对象没有被任何变量存下来的时候，它就会自动被释放
        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);//递归所有帧
}

//这个函数会在一秒钟调用60次，将1秒钟分成60份，60帧
requestAnimationFrame(AC_GAME_ANIMATION);//第一帧
