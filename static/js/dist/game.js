class AcGameMenu{
    constructor(root){
        this.root = root; //root对象就是web.html里的ac_game对象
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            设置
        </div>
    </div>
</div>
         `);
        //创建当前界面,html对象前一般加一个$，普通对象不加$。注意不是'而是`,类似python的''' 怎么写怎么显示到前端。
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find(".ac-game-menu-field-item-single-mode");
        this.$multi_mode = this.$menu.find(".ac-game-menu-field-item-multi-mode");
        this.$settings = this.$menu.find(".ac-game-menu-field-item-settings")
        
        this.start();
    }

    start(){
        this.add_listening_events();
    }
    //流程：constructor->start->add_listening_events
    add_listening_events(){
        //注意：在function内部使用this的时候其实是function本身，而不是外边的this，所以我们需要先把外边的this存一下
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
    }
    show(){
        this.$menu.show();
    }
    hide(){//关闭menu界面。点完单人多人模式后，关闭menu界面打开游戏界面
        this.$menu.hide();
    }
}
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
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');//canvas是一个数组？
        console.log(this.ctx);
        console.log(this.ctx.canvas);
        console.log(this.ctx.canvas.width);
        this.ctx.canvas.width = this.playground.width; //啥用？
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
        this.is_over = false;
    }

    start() {
    }

    update() {
        let txt = null;
        if(this.is_over)
            txt = "Game Over!"
        else
            txt = "对局开始！"
        this.render(txt);
    }

    render(txt) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font="100px Arial";
        this.ctx.fillStyle="#FF0000";
        this.ctx.fillText(txt, this.playground.width / 3, this.playground.height / 2);
    }
}
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
//this is a comment edited in vscode
class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;//获得画笔
        this.x = x;//坐标
        this.y = y;//坐标
        this.vx = 0;//在x坐标系方向上的速度
        this.vy = 0;//在y坐标系方向上移动的速度  (vx,vy是方向，speed是模)
        this.damage_x = 0; //遭受过火球攻击后的玩家的x轴速度
        this.damage_y = 0; //遭受过火球攻击后的玩家的y轴速度
        this.damage_speed = 0; //遭受火球攻击后的玩家的速度
        this.move_length = 0;
        this.radius = radius;//半径
        this.color = color;
        this.speed = speed; //speed * time 得距离，      每秒钟移动speed像素   ，speed * time 就得到了距离（单位像素）
        this.is_me = is_me; //是否是玩家自己
        this.eps = 0.1;
        this.friction = 0.9;
        this.spent_time = 0;//计时，用于度过前面的冷静期

        this.cur_skill = null; //当前状态持有的技能
    }

    start() {
        if (this.is_me) {//如果是自己的话，可以操作之
            this.add_listening_events();
        } else {//如果是其他小球，则使用随机目的地
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if (e.which === 3) {//keycode 1:左键  2:滚轮 3：右键
                outer.move_to(e.clientX, e.clientY);//clientXY是API获得点击的坐标,Player的移动，归根到底是画布上的作画，因此我们需要做的是根据鼠标点击目标位置的坐标，更新vx，vy。从而设置Player的坐标
            } else if (e.which === 1) {//鼠标按左键则触发该事件，触发后先判断是否持有技能，如果持有技能则发送火球！
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) {
            if (e.which === 81) {  // q
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }
    shoot_fireball2(vx, vy){
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        for (let i = 0; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x, y = this.y;
            let radius = this.radius * (Math.random() * 0.1 + 0.1);//例子的大小是0.1~0.2倍
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 0.8;
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        //电脑发射火球
        if (!this.is_me && this.spent_time > 4 && Math.random() < 1 / 300.0) {//一秒执行60次，因此5秒钟会执行300次判断，期望值是1，也即期望5秒一次炮弹
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];//Math.random 返回的是[0,1)
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            // let tx = 0;
            // let ty = 0;
            // let angle1 = Math.PI / 2 - Math.atan2(player.y - this.y, player.x - this.x);
            // let angle2 = Math.PI / 2 - Math.atan2(0 - player.vy, player.vx);
            // let theta = angle1 + angle2;
            // let fireball_speed = this.playground.height * 0.5;
            // let player_speed = this.speed;
            // let arefa = Math.asin(player_speed * 1.0 / fireball_speed * Math.sin(theta));
            // let fire_angle = Math.PI / 2 - (arefa + angle1);
            // let fireball_vx = Math.cos(fire_angle);
            // let fireball_vy = Math.sin(fire_angle);
            this.shoot_fireball(tx, ty);
            // shoot_fireball2(fireball_vx, fireball_vy);
        }

        //移动
        if (this.damage_speed > 10) {//撞击后的移动
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {//停止后的移动
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (!this.is_me) {//重新选择目标点
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);//speed * timedelta是按照当前速度要移动的距离
                this.x += this.vx * moved; //加上一帧所移动的距离，得下一个位置
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                if(this.is_me)
                {
                    this.playground.game_map.is_over = true;
                }

            }
        }
    }
    
}
class FireBall extends AcGameObject {//一个对象，可以理解成一个需要在图像中绘画的一个状态
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy(); //距离到达，则销毁
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
//html从上倒下渲染，遇到js执行js ,js是顺序执行的（先执行声明）
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        // this.hide();
         //创建当前界面,html对象前一般加一个$，普通对象不加$。注意不是'而是`,类似python的''' 怎么写怎么显示到前端。
        this.root.$ac_game.append(this.$playground); //把playground标签加到 
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));//我自己

        for (let i = 0; i < 5; i ++ ) {//其他人机玩家
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }

        this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    start() {
    }

    show() {  // 打开playground界面
        this.$playground.show();
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
export class AcGame {
    constructor(id) {
        this.id = id;
         //ac_game是给div取的名字，这行代码的意义是使用jQuery获得html里的div对象,以后方便往里面加东西
        this.$ac_game = $('#' + id);
        // this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {
    }
}
