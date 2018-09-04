import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import * as graphic from "./utils/graphic";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { Command } from "./core/socket";
import { RoomScene } from "./roomScene";
import { SelectionScene } from "./selectionScene";

export class MultiPlayerScene extends Scene {
    static readonly totalLevel = 6;
    roomContainer: PIXI.Container;

    constructor() {
        super();
        this.sceneName = "多人游戏";
        let l = new Label("赛场列表", { fontSize: 50 });
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
            if (data) {
                if (!data.e)
                    director.sceneManager.replace(new RoomScene());
                else
                    console.log(data.e);
            }
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
                let d = data[i];
                let b = new RectButton(420, 85, 0x00ff00);
                // b.text = `房间${i + 1}   (${data[i].u}/4)`;
                b['id'] = d.id;
                b.clickHandler = () => {
                    director.socket.send(Command.joinRoom, b['id']);
                }
                let l1 = new Label(d.n + '的赛场', { align: 'left', fontSize: 40 });
                b.addChild(l1);
                let l2 = new Label(d.k + '条跑道  ' + d.t+'秒决策时间', { align: 'left', fontSize: 25 });
                b.addChild(l2);
                let l3 = new Label(d.u + "/" + d.m, { align: 'left', fontSize: 40 });
                b.addChild(l3);
                l1.position.set(-190, -37);
                l2.position.set(-190, 7);
                l3.position.set(115, -25);
                this.roomContainer.addChild(b);
                b.position.set(director.config.width / 2, 200 + i * 110);
            }
        }
    }

    exit() {
        console.log('multi exit');
        director.socket.off(Command.createRoom);
        director.socket.off(Command.getRoomInfo);
    }
}
