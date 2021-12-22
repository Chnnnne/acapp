let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        
        this.has_called_start = false; //是否执行过start函数
        this.timedelta = 0;//当前帧距离上一帧的时间间隔      因为不同浏览器的帧率不一定相同，因此我们用时间来衡量速度

    }


    start(){//only do this function at first frame

    }
    update(){//do this every frame

    }

    on_destory(){//在被销毁之前执行一次
        
    }
    destory(){//delete this object , js当一个对象没有被任何变量存下来的时候，它就会自动被释放
       this.on_destory();

       for(let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if(AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
       }

    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for(let i = 0; i < AC_GAME_OBJECTS.length; i++){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }

    }

    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
