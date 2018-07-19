import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import * as graphic from "./utils/graphic";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/RectButton";
import { Command } from "./core/socket";
import { RoomScene } from "./roomScene";
import { SelectionScene } from "./selectionScene";

export class MultiPlayerScene extends Scene {
    static readonly totalLevel = 6;
    roomContainer: PIXI.Container;

    constructor() {
        super();
        let l = new Label("房间列表", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 100);

        let b = new RectButton(220, 65, 0xff0000);
        b.text = "创建房间";
        b.clickHandler = () => {
            director.socket.send(Command.createRoom);
        }
        this.addChild(b);
        b.position.set(director.config.width / 2, 700);

        let b2 = new RectButton(220, 65, 0xff0000);
        b2.text = "退出";
        b2.clickHandler = () => {
            director.sceneManager.replace(new SelectionScene());
        }
        this.addChild(b2);
        b2.position.set(director.config.width / 2, b.y + 100);

        this.roomContainer = new PIXI.Container();
        this.addChild(this.roomContainer);


        director.socket.on(Command.createRoom, (data) => {
            console.log(data);
            if (data)
                director.sceneManager.replace(new RoomScene());
        })

        director.socket.on(Command.joinRoom, (data) => {
            console.log(data);
            if (data)
                director.sceneManager.replace(new RoomScene());
        })
        // this.renderRooms([
        //     {u:3},{u:1},{u:2},{u:3}
        // ]);
    }

    enter() {
        director.socket.send(Command.getLobbyInfo);
        director.socket.on(Command.getLobbyInfo, (data) => {
            console.log(data);
            this.renderRooms(data);
        })
    }

    renderRooms(data) {
        this.roomContainer.removeChildren();
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let b = new RectButton(350, 80, 0x00ff00);
                b.text = `房间${i + 1}   (${data[i].u}/4)`;
                b['id'] = data[i].id;
                b.clickHandler = () => {
                    director.socket.send(Command.joinRoom, b['id']);
                }
                this.roomContainer.addChild(b);
                b.position.set(director.config.width / 2, 230 + i * 100);
            }
        }
    }

    exit() {
        console.log('multi exit');
        director.socket.off(Command.createRoom);
        director.socket.off(Command.getRoomInfo);
    }
}
