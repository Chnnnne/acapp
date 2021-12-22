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
