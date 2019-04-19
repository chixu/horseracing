import { Scene } from "./core/scene";
import * as director from "./core/director";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { ImageButton } from "./core/component/imageButton";
import { SinglePlayerScene } from "./singlePlayerScene";
import { MultiPlayerScene } from "./multiPlayerScene";
import { MatchListScene } from "./matchListScene";
import { RecordScene } from "./recordScene";
import { HelperScene } from "./helperScene";
import * as lStorage from "./component/LocalStorage";
import { Helper } from "./component/helper";
import * as display from "./utils/display";

export class SelectionScene extends Scene {
    lastButtonY = 100;
    buttonGap = 145;

    constructor() {
        super();
        display.addBg(this);
        this.sceneName = "初始界面";
        // let l = new Label("多空赛马", { fontSize: 50 });
        let l = director.resourceManager.createImage('logo.png');
        this.addChild(l);
        l.pivot.set(l.width / 2, l.height / 2);
        l.position.set(director.config.width / 2, 120);


        // console.log(lStorage.get('tutorial'));
        // console.log(lStorage.get('tutorial') === 1);
        // console.log(lStorage.get('tutorial') === '1');
        this.addButton("单人训练", () => {
            director.sceneManager.replace(new SinglePlayerScene());
            // director.sceneManager.replace(new HelperScene());
        });
        // this.addButton("多人训练", () => {
        //     director.socket.init().then(() =>
        //         director.sceneManager.replace(new MultiPlayerScene())
        //     );
        // });
        this.addButton("参加比赛", () => {
            if (director.user.isLogin)
                director.sceneManager.replace(new MatchListScene());
            else
                alert("请先登录海知平台");
        });
        this.addButton("教学演示", () => {
            director.sceneManager.replace(new HelperScene());
        });

        if (!director.user.isLogin) {
            let b = this.addButton("登 录", () => {
                director.user.showLogin(() => director.sceneManager.replace(new SelectionScene()));
            });
            // b.position.set();
        } else {
            this.addButton("排行榜", () => {
                director.sceneManager.push(new RecordScene());
            });
        }

        if (director.user.tutorial || lStorage.getNum('tutorial')) {
        } else {
            this.displayTutorialPopup();
            //show once
            lStorage.set('tutorial', 1);
        }
    }

    displayTutorialPopup() {
        let panel = display.addMsgbox({
            title: "你好",
            l1: "这是你第一次参加多空赛马",
            l2: "推荐你先观看教学演示",
            b2: {
                label: '教学演示',
                handler: () => director.sceneManager.replace(new HelperScene())
            },
            b1: {
                label: '跳过教学',
                handler: () => this.removeChild(panel)
            }
        });
        this.addChild(panel);
    }

    addButton(txt: string, callback) {
        // let b = new RectButton(220, 65, 0xff0000);
        // b.text = txt;
        let b = display.normalButton(txt);
        b.clickHandler = callback;
        this.addChild(b);
        this.lastButtonY += this.buttonGap
        b.position.set(137, this.lastButtonY);
        return b;
    }
}
