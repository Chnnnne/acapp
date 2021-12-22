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
