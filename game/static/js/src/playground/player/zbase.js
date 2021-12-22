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
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {//keycode 1:左键  2:滚轮 3：右键
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
                //outer.move_to(e.clientX, e.clientY);//clientXY是API获得点击的坐标,Player的移动，归根到底是画布上的作画，因此我们需要做的是根据鼠标点击目标位置的坐标，更新vx，vy。从而设置Player的坐标
            } else if (e.which === 1) {//鼠标按左键则触发该事件，触发后先判断是否持有技能，如果持有技能则发送火球！
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top); 
                    // outer.shoot_fireball(e.clientX, e.clientY);
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
