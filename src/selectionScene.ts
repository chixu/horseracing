import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import { CandleTrack } from "./component/candleTrack";
import { Axis } from "./component/axis";
import { Label } from "./core/component/label";
// import * as login from "./user";
import { ButtonGroup } from "./core/component/buttonGroup";
import { RectButton } from "./core/component/RectButton";
import { MainScene } from "./mainScene";
import { SinglePlayerScene } from "./singlePlayerScene";
import { MultiPlayerScene } from "./multiPlayerScene";
import { RecordScene } from "./recordScene";

export class SelectionScene extends Scene {

    constructor() {
        super();
        let l = new Label("多空赛马", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 150);
        // for (let i = 2; i <= 6; i++)
        let b = new RectButton(220, 65, 0xff0000);
        b.text = "单人游戏";
        b.clickHandler = () => {
            director.sceneManager.replace(new SinglePlayerScene());
        }
        this.addChild(b);
        b.position.set(director.config.width / 2, 50 + 240);

        let b2 = new RectButton(220, 65, 0xff0000);
        b2.text = "多人游戏";
        b2.clickHandler = () => {
            director.socket.init().then(() =>
                director.sceneManager.replace(new MultiPlayerScene())
            );
        }
        this.addChild(b2);
        b2.position.set(director.config.width / 2, b.y + 150);
        console.log(director.user.isLogin);
        if (!director.user.isLogin) {
            let b3 = new RectButton(220, 65, 0xff0000);
            b3.text = "登 录";
            b3.clickHandler = () => {
                director.user.showLogin(()=>director.sceneManager.replace(new SelectionScene()));
            }
            this.addChild(b3);
            b3.position.set(director.config.width / 2, b2.y + 150);
        } else {
            let b3 = new RectButton(220, 65, 0xff0000);
            b3.text = "龙虎榜";
            b3.clickHandler = () => {
                director.sceneManager.push(new RecordScene());
            }
            this.addChild(b3);
            b3.position.set(director.config.width / 2, b2.y + 150);
        }
    }
}
