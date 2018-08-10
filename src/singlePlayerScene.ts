import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import * as graphic from "./utils/graphic";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { ButtonGroup } from "./core/component/buttonGroup";
import { MainScene, GameMode } from "./mainScene";
import { SelectionScene } from "./selectionScene";

export class SinglePlayerScene extends Scene {
    static readonly totalLevel = 6;
    modeButton: ButtonGroup;

    constructor() {
        super();
        let l = new Label("选择关卡", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 150);
        for (let i = 0; i < SinglePlayerScene.totalLevel; i++)
            this.createButton(i);
        let bg = new ButtonGroup({
            buttonHeight: 60,
            buttonWidth: 140,
            texts: ["手动播放", "自动播放"]
        });
        bg.position.set(director.config.width / 2, 750);
        this.addChild(bg);
        this.modeButton = bg;

        let b2 = new RectButton(220, 65, 0xff0000);
        b2.text = "退出";
        b2.clickHandler = () => {
            director.sceneManager.replace(new SelectionScene());
        }
        this.addChild(b2);
        b2.position.set(director.config.width / 2, 820);
    }

    createButton(v: number) {
        let b = new RectButton(120, 120, 0xff0000);
        b.text = (v + 1).toString();
        this.addChild(b);
        b.position.set(director.config.width / 2 + v % 3 * 160 - 160, 350 + 200 * Math.floor(v / 3));
        if (v + 1 > director.user.unlockedLevel) {
            let texture = director.resourceManager.texture('lock');
            let image = new PIXI.Sprite(texture);
            let rect = graphic.rectangle(120, 120);
            rect.alpha = 0.5;
            b.addChild(rect);
            b.addChild(image);
            image.position.set(-40, -28);
            rect.position.set(-60, -60);
        } else {
            b.clickHandler = () => {
                director.sceneManager.replace(new MainScene({ n: v + 1, mode: this.modeButton.selectedIndex == 0 ? GameMode.Normal : GameMode.Auto }));
            }

        }
        return b;
    }
}
