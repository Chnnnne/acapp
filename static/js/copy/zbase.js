export class AcGame {
    constructor(id){
        this.id = id;
        this.$ac_game = $('#' + id); //ac_game是给div取的名字，这行代码的意义是使用jQuery获得html里的div对象
        //this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start(){//start其实就是构造函数的延伸
    
    }
}
