
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { ButtonGroup } from "./core/component/buttonGroup";
import { Scene } from "./core/scene";
import * as director from "./core/director";
import { Command } from "./core/socket";
import { MultiPlayerScene } from "./multiPlayerScene";
import { MultiMainScene } from "./multiMainScene";

export class RoomScene extends Scene {
    playerContainer: PIXI.Container;
    title: Label;
    trackButtons: ButtonGroup;
    timerButtons: ButtonGroup;
    exitButton;

    constructor() {
        super();
        this.sceneName = "游戏房间";
        let l = new Label("房间", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 100);
        this.title = l;

        let b2 = new RectButton(220, 65, 0xff0000);
        b2.text = "退出";
        b2.clickHandler = () => {
            // director.sceneManager.replace(new SelectionScene());
            director.socket.send(Command.leaveRoom);

        }
        this.addChild(b2);
        b2.position.set(director.config.width / 2, 800);
        this.exitButton = b2;
        this.playerContainer = new PIXI.Container();
        this.addChild(this.playerContainer);

        director.socket.on(Command.leaveRoom, (data) => {
            console.log(data);
            if (data)
                director.sceneManager.replace(new MultiPlayerScene());
        });
    }

    enter() {
        director.socket.send(Command.getRoomInfo);
        director.socket.on(Command.getRoomInfo, (data) => {
            console.log(data);
            if (data)
                this.renderPlayers(data);
        });
        director.socket.on(Command.startGame, (data) => {
            // MainScene.gameMode = GameMode.Multi;
            director.sceneManager.replace(new MultiMainScene(data));
        });
    }

    renderPlayers(data) {
        this.playerContainer.removeChildren();
        if (data) {
            this.title.value = data.id + '的赛场';
            let users = data.u;
            if (data.o && users.length > 1) {
                let b2 = new RectButton(220, 65, 0xff0000);
                b2.text = "开始游戏";
                b2.clickHandler = () => {
                    director.socket.send(Command.startGame, { n: this.trackButtons.selectedIndex + 1, t: this.timerButtons.selectedIndex + 1 });
                }
                this.playerContainer.addChild(b2);
                b2.position.set(director.config.width / 2, 780);
                this.exitButton.y = b2.y + 80;
            }
            if (data.o) {
                let bg = new ButtonGroup({
                    buttonHeight: 70,
                    buttonWidth: 70,
                    texts: ["1", "2", "3", "4", "5", "6"],
                    defaultIndex: data.n - 1
                });
                bg.position.set(director.config.width / 2, 620);
                this.playerContainer.addChild(bg);
                this.trackButtons = bg;

                let bg2 = new ButtonGroup({
                    buttonHeight: 55,
                    buttonWidth: 100,
                    texts: ["1秒", "2秒", "3秒"],
                    defaultIndex: data.t - 1,
                    textHeight: 35
                });
                bg2.position.set(director.config.width / 2, 700);

                bg2.selectHandler = bg.selectHandler = () => {
                    director.socket.send(Command.setRoomInfo, { n: bg.selectedIndex + 1, t: bg2.selectedIndex + 1 })
                };
                this.playerContainer.addChild(bg2);
                this.timerButtons = bg2;
            } else {
                let l = new Label(data.n + "条赛道", { fontSize: 40 });
                this.playerContainer.addChild(l);
                l.position.set(director.config.width / 2, 620);
                let l1 = new Label(data.t + '秒决策时间', { fontSize: 40 });
                this.playerContainer.addChild(l1);
                l1.position.set(director.config.width / 2, 700);
            }
            // users = ['123412', '123412', '123412', '123412', '123412', '123412', '123412', '123412', '123412'];
            for (let i = 0; i < users.length; i++) {
                let b = new RectButton(200, 65, 0x00ff00);
                b.text = users[i];
                // b.clickHandler = () => {
                //     // director.socket.send(Command.createRoom);
                // }
                this.playerContainer.addChild(b);
                b.position.set(director.config.width / 2 - 110 + 220 * (i % 2), 200 + Math.floor(i / 2) * 80);
            }
        }
    }

    exit() {
        console.log('room exit');
        director.socket.off(Command.leaveRoom);
        director.socket.off(Command.getRoomInfo);
        director.socket.off(Command.startGame);
    }
}