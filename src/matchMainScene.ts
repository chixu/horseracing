import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import { Command } from "./core/socket";
import { CandleTrack } from "./component/candleTrack";
import { Axis } from "./component/axis";
import { LocalDataAdapter } from "./component/dataAdapter";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/RectButton";
import * as http from "./utils/http";
import * as date from "./utils/date";
import * as graphic from "./utils/graphic";
import { SelectionScene } from "./selectionScene";
import { MainScene, GameMode } from "./mainScene";
import * as math from "./utils/math";
import * as array from "./utils/array";
import { MultiPlayerScene } from "./multiPlayerScene";
// import $ from "jquery";

export class MatchMainScene extends MainScene {
    constructor(options) {
        options.mode = GameMode.Match;
        super(options);
        this.sceneName = "比赛游戏";
    }

    renderGameOverUi() {
        this.winPanel = new PIXI.Container();
        this.addChild(this.winPanel);
        let rect = graphic.rectangle(director.config.width, director.config.height);
        this.winPanel.addChild(rect);
        rect.interactive = true;
        rect.alpha = 0.7;

        if (!this.options.lastmatch) {
            let nextBtn = new RectButton(180, 60, 0x11AA22);
            nextBtn.text = "下一场";
            nextBtn.position.set(director.config.width / 2, 670);
            nextBtn.clickHandler = () => {
                // director.sceneManager.replace(new MatchMainScene(opts));
                this.addMask();
                return director.request.post('get_user_submatch', {
                    user: director.user.name,
                    match: this.options.matchid
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
            this.winPanel.addChild(nextBtn);
        }
        let exitBtn = new RectButton(180, 60, 0xff0000);
        exitBtn.text = "退出";
        exitBtn.clickHandler = () => {
            director.sceneManager.replace(new SelectionScene());
        }
        exitBtn.position.set(director.config.width / 2, 760);
        this.winPanel.addChild(exitBtn);

    }

    gameOver(data?) {
        this.renderGameOverUi();
        let l3 = new Label(this.getPlayerRank(), { fontSize: 28 });
        this.winPanel.addChild(l3);
        l3.position.set(director.config.width / 2, 410);

        let l2 = new Label(`您最后的收益率为${this.profit.toFixed(2)}%\n  本场排名第${this.playerRank}`, { fontSize: 40, fill: 0xffffff });
        this.winPanel.addChild(l2);
        l2.position.set(director.config.width / 2, 170);

        //upload score
        let postData = this.getGamePostData();
        postData["submatchid"] = this.options.submatchid;
        postData["matchid"] = this.options.matchid;
        console.log(postData);
        director.request.post('upload_score', postData);
        this.gameOverTracker();
        this.renderGameOverUi2();
    }

    renderGameOverUi2() {
        let l1;
        if (this.options.lastmatch)
            l1 = new Label("比赛结束", { fontSize: 50, fill: 0xffd700 });
        else
            l1 = new Label("本场结束", { fontSize: 50 });
        this.winPanel.addChild(l1);
        l1.position.set(director.config.width / 2, 50);
    }
}
