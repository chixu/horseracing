import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import { CandleTrack } from "./component/candleTrack";
import { Axis } from "./component/axis";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/RectButton";
import { MainScene } from "./mainScene";
import { SinglePlayerScene } from "./singlePlayerScene";

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
    }
}
