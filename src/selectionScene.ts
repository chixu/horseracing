import { Scene } from "./core/scene";
import * as director from "./core/director";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { SinglePlayerScene } from "./singlePlayerScene";
import { MultiPlayerScene } from "./multiPlayerScene";
import { MatchListScene } from "./matchListScene";
import { RecordScene } from "./recordScene";
import { HelperScene } from "./helperScene";
import * as lStorage from "./component/LocalStorage";
import { Helper } from "./component/helper";

export class SelectionScene extends Scene {
    lastButtonY = 170;
    buttonGap = 120;

    constructor() {
        super();
        this.sceneName = "初始界面";
        let l = new Label("多空赛马", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 150);
        // console.log(lStorage.get('tutorial'));
        // console.log(lStorage.get('tutorial') === 1);
        // console.log(lStorage.get('tutorial') === '1');
        this.addButton("单人训练", () => {
            director.sceneManager.replace(new SinglePlayerScene());
            // director.sceneManager.replace(new HelperScene());
        });
        this.addButton("多人训练", () => {
            director.socket.init().then(() =>
                director.sceneManager.replace(new MultiPlayerScene())
            );
        });
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
            this.addButton("登 录", () => {
                director.user.showLogin(() => director.sceneManager.replace(new SelectionScene()));
            });
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
        let h1 = new Helper(0, 620, 600, 110, 0.7);
        // let color = this.helperTextColor;
        // let arrow = graphic.arrow(130, 370, 70, 3.14, 3, color);
        // h1.addChild(arrow);
        // let arrow2 = graphic.arrow(460, 370, 70, 3.14, 3, color);
        // h1.addChild(arrow2);
        // let arrow3 = graphic.arrow(290, 815, 80, 1.57, 3, color);
        // h1.addChild(arrow3);
        let l1 = new Label("这是你第一次参加多空赛马", { fontSize: 36, align: 'center' });
        let l2 = new Label("点击这里进入教学演示", { fontSize: 34, align: 'center' });
        l1.position.set(300, 300);
        l2.position.set(300, 450);
        let b = new RectButton(220, 65, 0x11AA22);
        b.text = "跳过教学";
        b.position.set(300, 770);
        b.clickHandler = () => this.removeChild(h1);
        h1.addChild(l1, l2, b);
        this.addChild(h1);
        // setTimeout(() => this.nextHelper(), 2000);
    }

    addButton(txt, callback) {
        let b = new RectButton(220, 65, 0xff0000);
        b.text = txt;
        b.clickHandler = callback;
        this.addChild(b);
        this.lastButtonY += this.buttonGap
        b.position.set(director.config.width / 2, this.lastButtonY);
    }
}
