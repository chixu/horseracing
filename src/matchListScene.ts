
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
import * as display from "./utils/display";
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
    rankConfirmPanel: PIXI.Container;
    // confirmMatchTitle: Label;
    matchData;
    shownIndex;

    constructor(index?) {
        super();
        display.addBg(this);
        this.shownIndex = index;
        this.sceneName = "赛场列表";
        // let l = new Label("赛场列表", { fontSize: 50 });
        // this.addChild(l);
        // l.position.set(director.config.width / 2, 100);
    }

    enter() {
        super.enter();
        // this.addMatch({ title: http.getQueryString('title') });
        director.request.post('get_user_match', { user: director.user.name }).then(res => {
            // console.log(res);
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
            let panel = display.addMsgbox({
                title: "赛场列表",
                l1: "尚未发现任何比赛",
                l2: "赶快去加入一个比赛吧",
                b2: {
                    label: '加入比赛',
                    handler: () => window.top.location.href = window.location.origin + "/group_competition"
                },
                b1: {
                    label: '退出',
                    handler: () => director.sceneManager.replace(new SelectionScene())
                }
            });
            this.addChild(panel);
        } else {
            display.addTitle(this, '赛场列表');
            this.scrollPanel = new ScrollPanel(director.config.width, 530);
            this.scrollPanel.position.set(0, 180);
            this.addChild(this.scrollPanel);
            for (let i = 0; i < res.length; i++) {
                let item = this.addMatch(res[i]);
                item['button']['index'] = i;
            }
            let b2 = display.exitButton();
            b2.clickHandler = () => {
                director.sceneManager.replace(new SelectionScene());
            }
            b2.y = 750;
            this.addChild(b2);
        }
    }

    addMatch(item, callback?) {
        // console.log(item);
        let status = this.getStatus(item);
        let res = new PIXI.Container();
        let left = director.resourceManager.createImage('item_left.png');
        let right = director.resourceManager.createImage(status == MatchStatusName.progress ? 'item_right_blue.png' : 'item_right_red.png');
        let b = new RectButton(550, 80, status == MatchStatusName.progress ? 0x11AA22 : 0xff0000);
        b.alpha = 0;
        res.addChild(left);
        res.addChild(right);
        res.addChild(b);
        left.position.set(-270, -40);
        right.x = left.x + 490;
        right.y = left.y;
        b.shortClick = 300;
        b.clickHandler = () => this.showConfirmScene(b['index']);
        res.position.set(director.config.width / 2 - 30, this.lastButtonY);
        let title: string = item.title;
        if (title.length > 18)
            title = title.substr(0, 18) + "...";
        // let l1 = new Label(title, { align: 'left', fontSize: math.clamp(27 - (title.length - 13) * 2, 22, 27) });
        let l1 = new Label(title, { align: 'left', fontSize: 21 });
        l1.position.set(-235, -11);
        res.addChild(l1);
        let l2 = new Label(status, { fontSize: 23 });
        l2.position.set(272, 2);
        res.addChild(l2);
        this.lastButtonY += this.buttonGap
        this.scrollPanel.addItem(res);
        res['button'] = b;
        return res;
    }

    getStatus(data): string {
        let t = parseInt(data.status) == MatchStatusCode.done ? MatchStatusName.done : MatchStatusName.progress;
        if (data.start == "1") t = MatchStatusName.notStart;
        if (data.end == "1") t = MatchStatusName.end;
        return t;
    }

    showRankConfirmScene(index) {
        this.rankConfirmPanel = display.addMsgbox({
            l1: "你将退出游戏然后跳转到排行榜",
            b1: {
                label: "取 消",
                handler: () => {
                    this.removeChild(this.rankConfirmPanel);
                    this.rankConfirmPanel = null;
                }
            },
            b2: {
                label: "确 定",
                handler: () => window.top.location.href = window.location.origin + "/hero_list/school_simu_competition_list/" + this.matchData[index].id
            }
        });
        this.addChild(this.rankConfirmPanel);
    }

    showConfirmScene(index) {
        console.log("showConfirmScene", index);
        let data = this.matchData[index];
        let progress = this.getStatus(data) == MatchStatusName.progress;
        let panelOptions = {
            l1: progress ? "你将进入的比赛是" : data.title,
            l2: progress ? data.title : "已结束",
            l3: progress ? "请不要中途退出比赛" : '',
            b1: {
                label: "取 消",
                handler: () => {
                    this.removeChild(this.confirmPanel);
                    this.confirmPanel = null;
                }
            },
            b2: {
                label: "比赛排行",
                handler: () => this.showRankConfirmScene(index)
            }
        }
        if (progress) {
            panelOptions['b3'] = {
                label: '进入比赛',
                handler: () => {
                    this.addMask();
                    // console.log(director.user.name, data.id);
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
                }
            }
        }
        this.confirmPanel = display.addMsgbox(panelOptions);
        this.addChild(this.confirmPanel);
    }

    // exit() {
    // }
}