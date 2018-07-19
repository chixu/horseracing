
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/RectButton";
import { Scene } from "./core/scene";
import * as director from "./core/director";
import { Command } from "./core/socket";
import { MultiPlayerScene } from "./multiPlayerScene";
import { MultiMainScene } from "./multiMainScene";

export class RoomScene extends Scene {
    playerContainer: PIXI.Container;
    title: Label;

    constructor() {
        super();
        let l = new Label("房间", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 150);
        this.title = l;

        let b2 = new RectButton(220, 65, 0xff0000);
        b2.text = "退出";
        b2.clickHandler = () => {
            // director.sceneManager.replace(new SelectionScene());
            director.socket.send(Command.leaveRoom);

        }
        this.addChild(b2);
        b2.position.set(director.config.width / 2, 800);

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
            director.sceneManager.replace(new MultiMainScene(data.n));
        });
    }

    renderPlayers(data) {
        this.playerContainer.removeChildren();
        if (data) {
            this.title.value = data.id + '的房间';
            let users = data.u;
            if (data.o && users.length > 1) {
                let b2 = new RectButton(220, 65, 0xff0000);
                b2.text = "开始游戏";
                b2.clickHandler = () => {
                    director.socket.send(Command.startGame);
                }
                this.playerContainer.addChild(b2);
                b2.position.set(director.config.width / 2, 700);
            }
            for (let i = 0; i < users.length; i++) {
                let b = new RectButton(350, 80, 0x00ff00);
                b.text = users[i];
                // b.clickHandler = () => {
                //     // director.socket.send(Command.createRoom);
                // }
                this.playerContainer.addChild(b);
                b.position.set(director.config.width / 2, 230 + i * 100);
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