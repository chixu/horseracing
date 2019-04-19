import { Scene } from "./core/scene";
// import { Candle } from "./component/candle";
import * as director from "./core/director";
// import * as graphic from "./utils/graphic";
import { Label } from "./core/component/label";
// import { RectButton } from "./core/component/rectButton";
// import { ButtonGroup } from "./core/component/buttonGroup";
import { MainScene, GameMode } from "./mainScene";
import { SelectionScene } from "./selectionScene";
import { ImageButton } from "./core/component/imageButton";
import { ToggleButton } from "./core/component/toggleButton";
import { ToggleButtonGroup } from "./core/component/toggleButtonGroup";
import * as display from "./utils/display";

export class SinglePlayerScene extends Scene {
    static readonly totalLevel = 6;
    modeButton: ToggleButtonGroup;

    constructor() {
        super();
        this.sceneName = "单人选关";
        display.addBg(this);
        display.addTitle(this, '选择关卡');
        // l.position.set(director.config.width / 2, 120);
        for (let i = 0; i < SinglePlayerScene.totalLevel; i++)
            this.createButton(i);
        let btnG = this.createToggleButtonGroup();
        btnG.position.set(director.config.width / 2, 680);
        this.addChild(btnG);
        this.modeButton = btnG;

        let b = display.exitButton();
        b.clickHandler = () => {
            director.sceneManager.replace(new SelectionScene());
        };
        this.addChild(b);
    }

    createToggleButton(text: string) {
        let b = new ToggleButton();
        b.top = new Label(text, { fontSize: 20 });
        let up = director.resourceManager.createImage('toggle.png');
        display.centerPivot(up);
        b.up = up;
        let down = new PIXI.Container();
        let up2 = director.resourceManager.createImage('toggle.png');
        display.centerPivot(up2);
        let down2 = director.resourceManager.createImage('toggle_highlight.png');
        display.centerPivot(down2);
        down.addChild(up2);
        down.addChild(down2);
        b.down = down;
        return b;
    }

    createToggleButtonGroup() {
        let values = ['手动播放', '自动播放'];
        let buttons = [];
        for (let k in values) {
            buttons.push(this.createToggleButton(values[k]));
        }
        return new ToggleButtonGroup({
            buttons: buttons,
            values: values,
            gap: 0
        })
    }

    createButton(v: number) {
        let isLocked = v + 1 > director.user.unlockedLevel;
        let b = new ImageButton({
            src: isLocked ? 'stage_icon_lock.png' : 'stage_icon.png',
            text: isLocked ? '' : (v + 1).toString(),
            textHeight: 50,
            textX: 72,
            textY: 82,
        });
        this.addChild(b);
        b.pivot.set(b.width / 2, b.height / 2);
        let gapH = 180;
        let gapV = 180;
        b.position.set(director.config.width / 2 + v % 3 * gapH - gapH, 320 + gapV * Math.floor(v / 3));
        if (!isLocked) {
            b.clickHandler = () => {
                director.sceneManager.replace(new MainScene({ n: v + 1, mode: this.modeButton.selectedIndex == 0 ? GameMode.Normal : GameMode.Auto }));
            }
        }
        return b;
    }
}
