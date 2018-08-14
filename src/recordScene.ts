
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/RectButton";
import { ButtonGroup } from "./core/component/buttonGroup";
import { Scene } from "./core/scene";
import * as director from "./core/director";
import { Command } from "./core/socket";

export class RecordScene extends Scene {
    recordContainer: PIXI.Container;
    trackButtons: ButtonGroup;

    constructor() {
        super();
        let l = new Label("排行榜", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 100);

        let b2 = new RectButton(220, 65, 0xff0000);
        b2.text = "退出";
        b2.clickHandler = () => {
            director.sceneManager.pop();
        }
        this.addChild(b2);
        b2.position.set(director.config.width / 2, 820);
        // this.exitButton = b2;

        this.recordContainer = new PIXI.Container();
        this.addChild(this.recordContainer);

        let bg = new ButtonGroup({
            buttonHeight: 70,
            buttonWidth: 70,
            texts: ["1", "2", "3", "4", "5", "6"],
            // defaultIndex: data.n - 1
        });
        bg.position.set(director.config.width / 2, 170);
        bg.selectHandler = (idx) => {
            console.log(idx, 'selected');
            this.getRankings(idx + 1);
        }
        this.addChild(bg);
        this.trackButtons = bg;
        bg.select(0, true);
    }

    getRankings(level) {
        director.request.get('get_score', { level: level }).then(res => {
            if (res.err) {
                console.log(res.err);
            } else
                this.renderRankings(res.data);
        });
    }

    renderRankings(data) {
        console.log(data);
        this.recordContainer.removeChildren();
        if (data.length == 0) {
            let l = new Label("还没有排名,快去挑战吧", { fontSize: 38 });
            l.position.set(director.config.width / 2, 260);
            this.recordContainer.addChild(l);
        } else {
            let h1 = new Label("排名", { fontSize: 35 });
            let h2 = new Label("玩家", { fontSize: 35 });
            let h3 = new Label("收益", { fontSize: 35 });
            h1.position.set(150, 250);
            h2.position.set(300, 250);
            h3.position.set(450, 250);
            this.recordContainer.addChild(h1);
            this.recordContainer.addChild(h2);
            this.recordContainer.addChild(h3);
            let i = 0;
            for (let k in data) {
                let d = data[k];
                let l1 = new Label((i + 1).toString(), { fontSize: 30 });
                let l2 = new Label(d.user, { fontSize: 30 });
                let l3 = new Label((parseFloat(d.value)).toFixed(2) + "%", { fontSize: 30 });
                l1.position.set(h1.x, h1.y + i * 50 + 46);
                l2.position.set(h2.x, h2.y + i * 50 + 46);
                l3.position.set(h3.x, h3.y + i * 50 + 46);
                this.recordContainer.addChild(l1);
                this.recordContainer.addChild(l2);
                this.recordContainer.addChild(l3);
                i++;
            }
        }
    }

    // renderPlayers(data) {
    //     this.recordContainer.removeChildren();
    //     if (data) {
    //         this.title.value = data.id + '的赛场';
    //         let users = data.u;
    //         if (data.o && users.length > 1) {
    //             let b2 = new RectButton(220, 65, 0xff0000);
    //             b2.text = "开始游戏";
    //             b2.clickHandler = () => {
    //                 director.socket.send(Command.startGame, { n: this.trackButtons.selectedIndex + 1, t: this.timerButtons.selectedIndex + 1 });
    //             }
    //             this.playerContainer.addChild(b2);
    //             b2.position.set(director.config.width / 2, 780);
    //             this.exitButton.y = b2.y + 80;
    //         }
    //         if (data.o) {

    //             this.trackButtons = bg;

    //             let bg2 = new ButtonGroup({
    //                 buttonHeight: 55,
    //                 buttonWidth: 100,
    //                 texts: ["1秒", "2秒", "3秒"],
    //                 defaultIndex: data.t - 1,
    //                 textHeight: 35
    //             });
    //             bg2.position.set(director.config.width / 2, 700);

    //             bg2.selectHandler = bg.selectHandler = () => {
    //                 director.socket.send(Command.setRoomInfo, { n: bg.selectedIndex + 1, t: bg2.selectedIndex + 1 })
    //             };
    //             this.playerContainer.addChild(bg2);
    //             this.timerButtons = bg2;
    //         } else {
    //             let l = new Label(data.n + "条赛道", { fontSize: 40 });
    //             this.playerContainer.addChild(l);
    //             l.position.set(director.config.width / 2, 620);
    //             let l1 = new Label(data.t + '秒决策时间', { fontSize: 40 });
    //             this.playerContainer.addChild(l1);
    //             l1.position.set(director.config.width / 2, 700);
    //         }
    //         // users = ['123412', '123412', '123412', '123412', '123412', '123412', '123412', '123412', '123412'];
    //         for (let i = 0; i < users.length; i++) {
    //             let b = new RectButton(200, 65, 0x00ff00);
    //             b.text = users[i];
    //             // b.clickHandler = () => {
    //             //     // director.socket.send(Command.createRoom);
    //             // }
    //             this.playerContainer.addChild(b);
    //             b.position.set(director.config.width / 2 - 110 + 220 * (i % 2), 200 + Math.floor(i / 2) * 80);
    //         }
    //     }
    // }
}