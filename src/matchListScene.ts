
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { ButtonGroup } from "./core/component/buttonGroup";
import { ScrollPanel } from "./core/component/scrollPanel";
import { Scene } from "./core/scene";
import * as director from "./core/director";
import * as graphic from "./utils/graphic";
import * as http from "./utils/http";
import * as math from "./utils/math";
import { Command } from "./core/socket";
import { MultiPlayerScene } from "./multiPlayerScene";
import { MultiMainScene } from "./multiMainScene";
import { SelectionScene } from "./selectionScene";
import { MatchMainScene } from "./matchMainScene";
import { GameMode } from "./mainScene";

export class MatchStatusCode {
    public static done = 2;
    public static progress = 1;
}

export class MatchStatusName {
    public static done = "已完成";
    public static progress = "进行中";
    public static notStart = "未开始";
    public static end = "已结束";
}

export class MatchListScene extends Scene {
    // playerContainer: PIXI.Container;
    // trackButtons: ButtonGroup;
    // timerButtons: ButtonGroup;
    // exitButton;
    scrollPanel: ScrollPanel;
    lastButtonY = 50;
    buttonGap = 100;
    confirmPanel: PIXI.Container;
    confirmMatchTitle: Label;
    matchData;
    shownIndex;

    constructor(index?) {
        super();
        this.shownIndex = index;
        this.sceneName = "赛场列表";
        let l = new Label("赛场列表", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 100);
    }

    enter() {
        super.enter();
        // this.addMatch({ title: http.getQueryString('title') });
        director.request.post('get_user_match', { user: director.user.name }).then(res => {
            console.log(res);
            if (res.err) {
                console.log(res.err);
            } else {
                this.init(res.data);
                if (this.shownIndex) {
                    for (let i = 0; i < this.matchData.length; i++) {
                        let data = this.matchData[i];
                        if (data.id == this.shownIndex) {
                            this.showConfirmScene(i);
                            return;
                        }
                    }
                }
            }
        });
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
            this.scrollPanel = new ScrollPanel(director.config.width - 60, 530);
            this.scrollPanel.position.set(30, 180);
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
        let status = this.getStatus(item);

        let b = new RectButton(500, 80, status == MatchStatusName.progress ? 0x00ff00 : 0xff0000);
        b.shortClick = 300;
        // b.text = item.title;
        if (status == MatchStatusName.progress)
            b.clickHandler = () => this.showConfirmScene(b['index']);
        b.position.set(director.config.width / 2 - 30, this.lastButtonY);
        let title: string = item.title;
        if (title.length > 18)
            title = title.substr(0, 18) + "...";
        let l1 = new Label(title, { align: 'left', fontSize: math.clamp(30 - (title.length - 13) * 2, 22, 30) });
        l1.position.set(-235, -15);
        b.addChild(l1);
        let l2 = new Label(status, { fontSize: 20 });
        l2.position.set(205, 10);
        b.addChild(l2);
        this.lastButtonY += this.buttonGap
        this.scrollPanel.addItem(b);
        return b;
    }

    getStatus(data): string {
        let t = parseInt(data.status) == MatchStatusCode.done ? MatchStatusName.done : MatchStatusName.progress;
        if (data.start == "1") t = MatchStatusName.notStart;
        if (data.end == "1") t = MatchStatusName.end;
        return t;
    }

    showConfirmScene(index) {
        let data = this.matchData[index];
        if (this.getStatus(data) != MatchStatusName.progress) return;
        if (this.confirmPanel) {
            this.confirmMatchTitle.value = data.title;
        } else {
            this.confirmPanel = new PIXI.Container();
            let bg = graphic.rectangle(director.config.width, director.config.height);
            bg.alpha = 0.9;
            this.confirmPanel.addChild(bg);

            let l = new Label("你将进入的比赛是", { fontSize: 30 });
            this.confirmPanel.addChild(l);
            l.position.set(director.config.width / 2, 300);

            let l2 = new Label(data.title, { fontSize: 40 });
            this.confirmPanel.addChild(l2);
            l2.position.set(director.config.width / 2, 380);

            let l3 = new Label("请不要中途退出比赛");
            this.confirmPanel.addChild(l3);
            l3.position.set(director.config.width / 2, 460);
            this.confirmMatchTitle = l2;

            let b = new RectButton(220, 65, 0x00ff00);
            b.text = '进入比赛';
            b.clickHandler = () => {
                this.addMask();
                console.log(director.user.name, data.id);
                return director.request.post('get_user_submatch', {
                    user: director.user.name,
                    match: data.id
                }).then(res => {
                    if (!res.err) {
                        res = res.data;
                        director.sceneManager.replace(new MatchMainScene({
                            n: parseInt(res.level),
                            r: parseInt(res.round),
                            code: res.code,
                            matchid: res.matchid,
                            submatchid: res.id,
                            enddate: res.enddate.split(' ')[0],
                            lastmatch: res.last
                        }));
                    }
                });
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