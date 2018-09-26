
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { ButtonGroup } from "./core/component/buttonGroup";
import { ScrollPanel } from "./core/component/scrollPanel";
import { Scene } from "./core/scene";
import * as director from "./core/director";
import * as graphic from "./utils/graphic";
import { Command } from "./core/socket";
import { MultiPlayerScene } from "./multiPlayerScene";
import { MultiMainScene } from "./multiMainScene";
import { SelectionScene } from "./selectionScene";

export class MatchListScene extends Scene {
    // playerContainer: PIXI.Container;
    // trackButtons: ButtonGroup;
    // timerButtons: ButtonGroup;
    // exitButton;
    scrollPanel: ScrollPanel;
    lastButtonY = 50;
    buttonGap = 110;
    confirmPanel: PIXI.Container;
    confirmMatchTitle: Label;
    matchData;

    constructor() {
        super();
        this.sceneName = "赛场列表";
        let l = new Label("赛场列表", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 100);
    }

    enter() {
        super.enter();
        director.request.get('get_match', { level: 'user' }).then(res => {
            if (res.err) {
                console.log(res.err);
            } else
                this.init(res);
        });
        this.init([{ title: '大赛1' },
        { title: '大赛12' },
        { title: '大赛13' },
        { title: '大赛14' }]);
    }

    init(res) {
        this.matchData = res;
        if (res.length == 0) {
            let l = new Label("尚未发现任何比赛，赶快去加入一个比赛吧");
            this.addChild(l);
            l.position.set(director.config.width / 2, 300);

            let b = new RectButton(220, 65, 0x00ff00);
            b.text = '加入比赛';
            b.clickHandler = () => {
                window.top.location.href = window.location.origin + "/group_competition";
            };
            b.position.set(director.config.width / 2, 700);
            this.addChild(b);
        } else {
            this.scrollPanel = new ScrollPanel(director.config.width - 100, 530);
            this.scrollPanel.position.set(50, 180);
            this.addChild(this.scrollPanel);
            for (let i = 0; i < res.length; i++) {
                let btn = this.addMatch(res[i]);
                btn['index'] = i;
            }
        }
        let b2 = new RectButton(220, 65, 0xff0000);
        b2.text = '退出';
        b2.clickHandler = () => {
            director.sceneManager.replace(new SelectionScene());
        };
        b2.position.set(director.config.width / 2, 800);
        this.addChild(b2);
    }

    addMatch(item, callback?) {
        let b = new RectButton(360, 80, 0xff0000);
        b.shortClick = 300;
        b.text = item.title;
        b.clickHandler = () => this.showConfirmScene(b['index']);
        b.position.set(director.config.width / 2 - 50, this.lastButtonY);
        this.lastButtonY += this.buttonGap
        this.scrollPanel.addItem(b);
        return b;
    }

    showConfirmScene(index) {
        if (this.confirmPanel) {
            this.confirmMatchTitle.value = this.matchData[index].title;
        } else {
            this.confirmPanel = new PIXI.Container();
            let bg = graphic.rectangle(director.config.width, director.config.height);
            bg.alpha = 0.9;
            this.confirmPanel.addChild(bg);

            let l = new Label("你将进入的比赛是", { fontSize: 30 });
            this.confirmPanel.addChild(l);
            l.position.set(director.config.width / 2, 300);

            let l2 = new Label(this.matchData[index].title, { fontSize: 40 });
            this.confirmPanel.addChild(l2);
            l2.position.set(director.config.width / 2, 380);

            let l3 = new Label("请不要中途退出比赛");
            this.confirmPanel.addChild(l3);
            l3.position.set(director.config.width / 2, 460);
            this.confirmMatchTitle = l2;

            let b = new RectButton(220, 65, 0x00ff00);
            b.text = '进入比赛';
            b.clickHandler = () => {

            };
            b.position.set(director.config.width / 2, 600);
            this.confirmPanel.addChild(b);
            let b2 = new RectButton(220, 65, 0xff0000);
            b2.text = '取 消';
            b2.clickHandler = () => {
                this.removeChild(this.confirmPanel);
            };
            b2.position.set(director.config.width / 2, 700);
            this.confirmPanel.addChild(b2);
        }
        this.addChild(this.confirmPanel);
    }

    // exit() {
    // }
}