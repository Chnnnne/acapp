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
