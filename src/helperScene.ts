import * as director from "./core/director";
import { Label } from "./core/component/label";
// import { RectButton } from "./core/component/RectButton";
import * as graphic from "./utils/graphic";
import * as display from "./utils/display";
import { SelectionScene } from "./selectionScene";
import { MainScene, GameMode } from "./mainScene";
import { Helper } from "./component/helper";
import * as lStorage from "./component/LocalStorage";

export class HelperScene extends MainScene {
    helperContainer: PIXI.Container;
    helperIndex: number;
    helperTextColor: number;
    helperFontSize: number;

    constructor() {
        let options: any = {};
        options.mode = GameMode.Helper;
        options.n = 1;
        options.r = 15;
        super(options);
        // this.helperTextColor = 0xFFFF00;
        this.helperTextColor = 0x7afff9;
        this.helperFontSize = 24;
        this.sceneName = "帮助";
        this.uploadingScore = false;
    }

    gameStart() {
        // console.log('gamestart');
        this.next();
        this.enabled = false;
        this.nextHelper();
        this.startTime = new Date();
    }

    page1() {
        let h1 = new Helper(0, 0, 600, 400);
        h1.addChild(this.addContinueButton());
        let l1 = new Label("红色线: 我的市值曲线", { fontSize: this.helperFontSize, fill: 0xff0000, align: 'left' });
        let l2 = new Label("白色线: 上证指数的市值曲线", { fontSize: this.helperFontSize, fill: 0xffffff, align: 'left' });
        let l3 = new Label("其他色线: 对应颜色股票的市值曲线", { fontSize: this.helperFontSize, fill: 0xFFAEFD, align: 'left' });
        l1.position.set(50, 420);
        l2.position.set(50, 480);
        l3.position.set(50, 540);
        h1.addChild(l1, l2, l3);
        this.helperContainer.addChild(h1);
    }

    page2() {
        let h1 = new Helper(0, 400, 600, 500);
        let color = this.helperTextColor;
        let arrow = graphic.arrow(130, 370, 70, 3.14, 3, color);
        h1.addChild(arrow);
        let arrow2 = graphic.arrow(460, 370, 70, 3.14, 3, color);
        h1.addChild(arrow2);
        let arrow3 = graphic.arrow(290, 815, 80, 1.57, 3, color);
        h1.addChild(arrow3);
        let l1 = new Label("选择空仓", { fontSize: this.helperFontSize, align: 'left', fill: color });
        let l2 = new Label("选择持有该只股票", { fontSize: this.helperFontSize, align: 'left', fill: color });
        let l3 = new Label("股票信息", { fontSize: this.helperFontSize, align: 'left', fill: color });
        l1.position.set(80, 330);
        l2.position.set(340, 330);
        l3.position.set(150, 800);
        h1.addChild(l1, l2, l3);
        h1.addChild(this.addContinueButton());
        this.helperContainer.addChild(h1);
        // setTimeout(() => this.nextHelper(), 2000);
    }

    chooseCash(deltaY = 0, txt = "") {
        this.enabled = true;
        let color = this.helperTextColor;
        let h1 = new Helper(0, 400, 300, 500, 0.3);
        let arrow = graphic.arrow(130, 370 - deltaY, 80, 3.14, 3, color);
        h1.addChild(arrow);
        txt = txt || "先试试持有这只股票";
        let line = txt.split('\n').length;
        let size = line > 1 ? 23 : 27;
        let l1 = new Label(txt, { fontSize: size, align: 'left', fill: color });
        l1.position.set(80, 350 - deltaY - 30 * line);
        this.enabled = true;
        h1.addChild(l1);
        this.helperContainer.addChild(h1);
    }

    chooseStock(deltaY = 0, txt = "") {
        this.enabled = true;
        let color = this.helperTextColor;
        let h1 = new Helper(300, 500, 300, 500, 0.3);
        let arrow = graphic.arrow(460, 370 - deltaY, 70, 3.14, 3, color);
        h1.addChild(arrow);
        txt = txt || "先试试持有这只股票";
        let line = txt.split('\n').length;
        let size = line > 1 ? 23 : 27;
        let l1 = new Label(txt, { fontSize: size, align: 'left', fill: color });
        l1.position.set(340, 350 - deltaY - 30 * line);
        this.enabled = true;
        h1.addChild(l1);
        this.helperContainer.addChild(h1);
    }

    page3() {
        // this.chooseCash();
        this.chooseStock();
    }

    page4() {
        let h1 = new Helper(0, 0, 600, 500);
        let color = this.helperTextColor;
        let arrow = graphic.arrow(90, 300, 250, 0.1, 3, color);
        h1.addChild(arrow);
        let arrow2 = graphic.arrow(360, 380, 150, 0.95, 3, color);
        h1.addChild(arrow2);
        let l1 = new Label("因持有股票下跌 市值减小", { fontSize: 24, fill: color, align: "left" });
        let l2 = new Label("因为和股票收益一样\n红色的市值曲线\n暂时被股票曲线挡住", { fontSize: 22, fill: color, align: "left" });
        l1.position.set(70, 315);
        l2.position.set(280, 390);
        h1.addChild(l1, l2);
        h1.addChild(this.addContinueButton());
        this.helperContainer.addChild(h1);
        // setTimeout(() => this.nextHelper(), 3000);
    }

    page5() {
        this.chooseCash(-20, "股票呈下跌趋势\n赶快试试空仓吧");
    }

    page6() {
        let h1 = new Helper(0, 0, 600, 500);
        let color = this.helperTextColor;
        let arrow = graphic.arrow(90, 300, 250, 0.1, 3, color);
        h1.addChild(arrow);
        let arrow2 = graphic.arrow(360, 380, 150, 0.95, 3, color);
        h1.addChild(arrow2);
        let l1 = new Label("刚刚空仓 躲过了损失\n市值不变", { fontSize: 24, fill: color, align: "left" });
        let l2 = new Label("因为市值不变\n红色的市值曲线呈水平", { fontSize: 22, fill: color, align: "left" });
        l1.position.set(70, 315);
        l2.position.set(280, 390);
        h1.addChild(l1, l2);
        h1.addChild(this.addContinueButton());
        this.helperContainer.addChild(h1);
        // setTimeout(() => this.nextHelper(), 3000);
    }

    page7() {
        this.chooseCash(-20, "下跌趋势显著\n继续空仓吧");
    }

    page8() {
        this.chooseStock(-20, "感觉要反弹了\n试试持有股票");
    }

    page9() {
        this.chooseStock(-20, "如果选择相同股票\n代表继续持有");
    }

    page10() {
        let h1 = new Helper(280, 0, 100, 80);
        let color = this.helperTextColor;
        let b = this.addContinueButton();
        b.clickHandler = () => {
            this.removeChild(this.helperContainer);
            this.enabled = true;
        }
        let arrow = graphic.arrow(320, 130, 70, 0.1, 3, color);
        h1.addChild(arrow);
        let l1 = new Label("这里是已选择的次数/总次数", { fontSize: 23, fill: color, align: "left" });
        let l2 = new Label("看来你已经掌握了看盘的技巧", { fontSize: 32, fill: color });
        let l3 = new Label("继续挑战吧！", { fontSize: 32, fill: color });
        l1.position.set(200, 135);
        l2.position.set(300, 300);
        l3.position.set(300, 390);
        h1.addChild(l1, l2, l3);
        h1.addChild(b);
        this.helperContainer.addChild(h1);
    }

    addContinueButton(): any {
        // let b = new RectButton(220, 65, 0x11AA22);
        // b.text = "继 续";
        let b = display.normalButton('继 续');
        b.y = 650;
        b.clickHandler = () => this.nextHelper();
        return b;
    }

    onTrackClickEnd() {
        console.log('onTracker Eend', this.round);
        // 
        if ([2, 3, 8, 9, 10].indexOf(this.round) > -1) {
            this.enabled = false;
            this.nextHelper();
        }
    }

    nextHelper() {
        if (!this.helperContainer)
            this.helperContainer = new PIXI.Container();
        this.helperContainer.removeChildren();
        this.addChild(this.helperContainer);
        if (!this.helperIndex) this.helperIndex = 1;
        this['page' + this.helperIndex]();
        this.helperIndex++;
    }

    // renderGameOverUi() {
    //     if (this.winPanel == undefined) {
    //         this.winPanel = new PIXI.Container;
    //     }
    //     this.addChild(this.winPanel);
    //     this.winPanel.removeChildren();
    //     let rect = graphic.rectangle(director.config.width, director.config.height);
    //     this.winPanel.addChild(rect);
    //     rect.interactive = true;
    //     rect.alpha = 0.7;
    //     // let exit = new RectButton(180, 60, 0xff0000);
    //     // exit.text = "退出";
    //     // exit.clickHandler = () => {
    //     //     director.sceneManager.replace(new SelectionScene());
    //     // }
    //     // exit.position.set(director.config.width / 2, 760);

    //     let exit = display.normalButton('退 出');
    //     exit.y = 750;
    //     exit.clickHandler = () => director.sceneManager.replace(new SelectionScene());
    //     this.winPanel.addChild(exit);
    // }

    // renderGameOverUi2() {
    //     let playerRank = this.playerRank;
    //     let l1 = new Label("恭喜你", { fontSize: 50, fill: 0xffd700 });
    //     this.winPanel.addChild(l1);
    //     l1.position.set(director.config.width / 2, 50);

    //     let l2 = new Label("如果你获得第一名，还会解锁更多关卡，赶快去挑战吧！", { fontSize: 24, fill: 0xffd700 });
    //     this.winPanel.addChild(l2);
    //     l2.position.set(director.config.width / 2, 250);

    //     lStorage.set('tutorial', 1);
    //     if (director.user.isLogin)
    //         director.request.post('update_user_tutorial');
    // }

    setWinPanelBtns() {
        lStorage.set('tutorial', 1);
        if (director.user.isLogin)
            director.request.post('update_user_tutorial');
        this.winPanelInfo.title = "恭喜你"
        this.winPanelInfo.l3 = "如果你获得第一名，还会解锁更多关卡，赶快去挑战吧！";
        this.winPanelInfo.b1 = {
            label: "退出",
            handler: () => director.sceneManager.replace(new SelectionScene())
        }
    }
}
