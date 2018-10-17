import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import { Command } from "./core/socket";
import { CandleTrack } from "./component/candleTrack";
import { Axis } from "./component/axis";
import { ServerDataAdapter } from "./component/dataAdapter";
import * as lStorage from "./component/LocalStorage";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import * as http from "./utils/http";
import * as date from "./utils/date";
import * as graphic from "./utils/graphic";
import { SelectionScene } from "./selectionScene";
import * as math from "./utils/math";
import * as array from "./utils/array";
import { SelfTrack } from "./component/selfTrack";
import { SinglePlayerScene } from "./singlePlayerScene";
import { RecordScene } from "./recordScene";
import { IndexTrack } from "./component/indexTrack";
// import $ from "jquery";
export const START_CASH = 100000;

export const enum GameMode {
    Multi, Auto, Normal, Match
}

export class MainScene extends Scene {
    // container;
    tracks: CandleTrack[];
    focusTrack: CandleTrack;
    tracksWidth;
    trackGap: number;
    numTracks;
    scoreLabel: Label;
    titleLabel: Label;
    cash: number;
    stockPosition: { track: CandleTrack, amount: number };
    closePrice = 10;
    // skipButton: RectButton;
    round: number;
    totalRound: number;
    readonly numHistoryPoints: number = 20;
    axis: Axis;
    sideAxis: Axis;
    winPanel: PIXI.Container;
    gameMode: GameMode;
    enabled: boolean;
    //inited: boolean = false;
    static renderHorse = true;
    autoPlay: number;
    history: { i: number, time: any, profit: number, code: string }[];
    options;
    startTime;
    loadingPanel: PIXI.Container;
    playerRank: number;
    showIndex: boolean = true;

    constructor(options) {
        super();
        this.sceneName = "单人游戏";
        this.options = options;
        this.gameMode = options.mode == undefined ? GameMode.Normal : options.mode;
        this.numTracks = options.n || 3;
        // this.numTracks = 6;
        this.totalRound = options.r || 25;
        this.options.days = this.numHistoryPoints + this.totalRound + 1;
        this.scoreLabel = new Label('', { align: 'left', fontSize: 25 });
        this.scoreLabel.position.set(5, 5);
        this.addChild(this.scoreLabel);
        this.titleLabel = new Label('', { align: 'left', fontSize: 25 });
        this.titleLabel.position.set(300, 5);
        this.addChild(this.titleLabel);

        let horseButton = new RectButton(100, 40, 0x0000ff);
        horseButton.text = MainScene.renderHorse ? "显示K线" : "显示赛马";
        horseButton.position.set(director.config.width - 50, 20)
        horseButton.clickHandler = () => {
            if (horseButton.text == "显示赛马") {
                horseButton.text = "显示K线";
                MainScene.renderHorse = true;
            } else {
                horseButton.text = "显示赛马";
                MainScene.renderHorse = false;
            }
            this.axis.clearGraph();
            for (let i = 0; i < this.tracks.length; i++) {
                this.tracks[i].renderCandle();
            }
        }
        this.addChild(horseButton);

        let showButton = new RectButton(100, 40, 0x0000ff);
        showButton.text = "显示按钮";
        showButton.position.set(director.config.width - 155, 20)
        showButton.clickHandler = () => {
            if (showButton.text == "显示按钮") {
                showButton.text = "隐藏按钮";
                for (let i = 0; i < this.tracks.length; i++)
                    this.tracks[i].showButton();
            } else {
                showButton.text = "显示按钮";
                for (let i = 0; i < this.tracks.length; i++)
                    this.tracks[i].showButton(false);
            }
        }
        this.addChild(showButton);
        // let infoButton = new RectButton(100, 40, 0x00ff00);
        // infoButton.text = MainScene.renderHorse ? "显示数据" : "隐藏数据";
        // infoButton.position.set(director.config.width - 150, 20)
        // infoButton.clickHandler = () => {
        //     console.log(infoButton.text);
        //     if (infoButton.text == "显示赛马") {
        //         infoButton.text = "显示K线";
        //         MainScene.renderHorse = true;
        //     } else {
        //         infoButton.text = "显示赛马";
        //         MainScene.renderHorse = false;
        //     }
        //     this.axis.clearGraph();
        //     for (let i = 0; i < this.tracks.length; i++) {
        //         this.tracks[i].renderCandle();
        //     }
        // }
        // this.addChild(infoButton);
        this.tracksWidth = 310 + 22 * this.numTracks;
        this.tracks = [];
        this.trackGap = 0;
        let right = director.config.width / 2;
        this.trackGap = this.tracksWidth / (this.numTracks);
        right = director.config.width / 2 - this.tracksWidth / 2;
        for (let i = 0; i < this.numTracks + 1; i++) {
            let ct = i == 0 ? new SelfTrack(this) : new CandleTrack(this, i);
            this.tracks.push(ct);
            ct.position.set(right + this.trackGap * i, 560);
            this.addChild(ct);
        }
        if (this.showIndex) {
            let ct = new IndexTrack(this, this.numTracks + 1);
            this.tracks.push(ct);
        }
        this.init();
    }

    getData() {
        let dataAdapter = new ServerDataAdapter(this);
        this.startLoading();
        return dataAdapter.getData().then(datas => {
            // console.log(datas);
            this.tracks[0].setDatas();
            let i = 0;
            for (let k in datas) {
                //如果是指数数据
                if (k[0] == 'i') {
                    this.tracks[this.tracks.length - 1].setDatas(datas[k], k);
                } else {
                    i++
                    this.tracks[i].setDatas(datas[k], k);
                }
            }
            this.stopLoading();
            this.dataReceived();
        });
    }

    get totalAmount(): number {
        let c = this.cash;
        if (this.stockPosition != undefined) {
            c += this.stockPosition.track.price * this.stockPosition.amount;
        }
        return c;
    }

    updateScore() {
        // let c = this.cash;
        // if (this.stockPosition != undefined) {
        //     c += this.stockPosition.track.price * this.stockPosition.amount;
        // }
        this.scoreLabel.value = '总市值: ' + this.totalAmount.toFixed(2);
        this.titleLabel.value = this.round + '/' + this.totalRound;
    }

    // enter(args?) {
    // }

    init(useOldData = false) {
        this.cash = START_CASH;
        this.stockPosition = undefined;
        this.focusTrack = undefined;
        this.enabled = true;
        this.updateScore();
        this.round = 0;
        this.history = [];
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].clearData();
        }
        if (useOldData) {
            this.dataReceived();
        } else {
            this.getData();
        }
    }

    dataReceived(args?) {
        // super.enter(args);
        if (this.axis == undefined) {
            this.axis = new Axis({
                max: 0.08,
                min: -0.03,
                width: this.tracksWidth + 80,
                height: 270,
                percent: true
            }, this);
            this.addChild(this.axis);
            this.axis.position.set(director.config.width / 2, 480);
        }
        if (this.sideAxis == undefined) {
            this.sideAxis = new Axis({
                max: 0.08,
                min: -0.03,
                width: 500,
                height: 300,
                percent: true
            }, this);
            this.addChild(this.sideAxis);
            this.sideAxis.position.set(director.config.width / 2, 80);

        }
        this.gameStart();
    }

    gameStart() {
        // console.log('gamestart');
        this.next();
        this.startTime = new Date();
        if (this.gameMode == GameMode.Auto)
            this.autoPlay = setInterval(() => this.next(), 1000);
    }

    renderNext() {
        let max = 0, min = 0, hmax = 0, hmin = 0;
        for (let i = this.tracks.length - 1; i >= 0; i--) {
            let track: CandleTrack = this.tracks[i];
            track.nextData();
            max = Math.max(max, track.historyMax);
            min = Math.min(min, track.historyMin);
            // console.log(track.historyMin, track.historyMax)
            hmax = Math.max(hmax, track.historyMax);
            hmin = Math.min(hmin, track.historyMin);
        }
        this.axis.render(min, max);
        this.sideAxis.render(hmin, hmax);
        this.renderFrontAxis();
        this.renderSideAxis();
        this.renderPlayers();
        this.updateScore();
    }

    next() {
        this.round++;
        this.renderNext();
        if (this.focusTrack) {
            let time: any = new Date();
            this.history.push({
                i: this.focusTrack.index,
                time: time - this.startTime,
                profit: math.toFixedNumber(this.profit),
                code: this.focusTrack.stockCode
            });
            // console.log(this.history);
        }
        if (this.round == this.totalRound) {
            clearInterval(this.autoPlay);
            this.gameOver();
        }
        this.enabled = true;
    }

    renderFrontAxis() {
        this.axis.clearGraph();
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].renderCandle();
        }
    }

    renderSideAxis() {
        this.sideAxis.clearGraph();
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].renderLine();
        }
    }

    renderPlayers() {
    }

    renderGameOverUi() {
        if (this.winPanel == undefined) {
            this.winPanel = new PIXI.Container;
        }
        this.addChild(this.winPanel);
        this.winPanel.removeChildren();
        let rect = graphic.rectangle(director.config.width, director.config.height);
        this.winPanel.addChild(rect);
        rect.interactive = true;
        rect.alpha = 0.7;

        let replay2 = new RectButton(180, 60, 0x00ff00);
        replay2.text = "换股";
        replay2.position.set(director.config.width / 2, 760);
        replay2.clickHandler = () => {
            this.removeChild(this.winPanel);
            this.init();
        }
        this.winPanel.addChild(replay2);
        let exit = new RectButton(180, 60, 0xff0000);
        exit.text = "退出";
        exit.clickHandler = () => {
            director.sceneManager.replace(new SelectionScene());
        }
        exit.position.set(director.config.width / 2, 850);
        this.winPanel.addChild(exit);

        let rank = new RectButton(180, 60, 0x00ff00);
        rank.position.set(director.config.width / 2, 670);
        rank.text = director.user.isLogin ? "龙虎榜" : "登录";
        rank.clickHandler = () => {
            if (director.user.isLogin) {
                director.sceneManager.push(new RecordScene());
            } else {
                director.user.showLogin(() => director.sceneManager.push(new RecordScene()));
            }
        }
        this.winPanel.addChild(rank);
    }

    renderGameOverUi2() {
        let playerRank = this.playerRank;
        let l1;
        if (playerRank == 1)
            l1 = new Label("恭喜你", { fontSize: 50, fill: 0xffd700 });
        else
            l1 = new Label("游戏结束", { fontSize: 50 });
        this.winPanel.addChild(l1);
        l1.position.set(director.config.width / 2, 50);

        if (playerRank == 1) {
            let l2 = new Label("赶快" + (director.user.isLogin ? "" : "登录海知账号") + "去龙虎榜看下你的排名吧!", { fontSize: 25, fill: 0xffd700 });
            this.winPanel.addChild(l2);
            l2.position.set(director.config.width / 2, 250);
        }

        if (playerRank == 1) {
            if (director.user.unlockedLevel == this.numTracks)
                director.user.unlockedLevel++;
            if (director.user.unlockedLevel <= SinglePlayerScene.totalLevel) {
                let next = new RectButton(180, 60, 0x00ff00);
                next.text = "下一关";
                next.position.set(director.config.width / 2, 580);
                next.clickHandler = () => {
                    director.sceneManager.replace(new MainScene({ n: director.user.unlockedLevel, mode: this.gameMode }));
                }
                this.winPanel.addChild(next);
            }
        }
    }

    gameOver(data?) {
        //uploadScore
        // let percent = this.totalAmount / START_CASH - 1;
        // console.log('percent', percent);
        //let l2 = new Label(`您最后的收益率为${(percent * 100).toFixed(2)}%\n击败了${(1 / (1 + Math.pow(2, -30 * percent)) * 100).toFixed(2)}%的玩家`, { fontSize: 40 });
        this.renderGameOverUi();
        // let rank = '';
        // let playerRank;

        // console.log(rank);
        let l3 = new Label(this.getPlayerRank(), { fontSize: 28 });
        this.winPanel.addChild(l3);
        l3.position.set(director.config.width / 2, 410);

        let l2 = new Label(`您最后的收益率为${this.profit.toFixed(2)}%\n赛场排名第${this.playerRank}`, { fontSize: 40, fill: 0xffffff });
        this.winPanel.addChild(l2);
        l2.position.set(director.config.width / 2, 170);

        //upload score

        let postData = this.getGamePostData();
        if (director.user.isLogin) {
            director.request.post('upload_score', postData);
        } else {
            lStorage.setRecord(postData);
        }

        // director.request.get('break_record', {
        //     level: this.numTracks,
        //     value: this.profit,
        //     user: director.user.name
        // }).then(res => {
        //     if (!res.err && res.data) {
        //         let l4 = new Label(`你的收益超过了其他理财师，快去龙虎榜看一看！`, { fontSize: 27, fill: 0xffd700 });
        //         this.winPanel.addChild(l4);
        //         l4.position.set(director.config.width / 2, 270);
        //     }
        // })
        this.gameOverTracker();
        this.renderGameOverUi2();
    }

    getPlayerRank() {
        let rankTxt = "";
        let alltracks = [];
        for (let i = 0; i < this.tracks.length; i++) {
            alltracks.push(this.tracks[this.tracks.length - 1 - i]);
        }
        let sortedTracks = array.sortDescApprox(alltracks, 'profit');
        for (let i = 0; i < sortedTracks.length; i++) {
            // console.log(sortedTracks[i].profit);
            let t: CandleTrack = sortedTracks[i]
            let name = t.stockName || director.user.name || '玩家';
            let d = '';
            if (t.stockName) {
                d = '(' + date.dateToYYmmdd(t.startDate) + '-' + date.dateToYYmmdd(t.endDate) + ')';
            } else {
                this.playerRank = i + 1;
            }
            rankTxt += (i + 1) + '. ' + name + d + '  ' + t.profit.toFixed(2) + '%\n';
        }
        return rankTxt;
    }

    getGamePostData() {
        let playerRank = this.playerRank;
        let t: CandleTrack = this.tracks[1];
        let tracks = [];
        for (let i = 1; i < this.numTracks + 1; i++)
            tracks.push(this.tracks[i].stockCode);
        let resData = {
            numTrack: this.numTracks,
            startDate: date.dateToYYmmdd(t.startDate),
            endDate: date.dateToYYmmdd(t.endDate),
            tracks: tracks,
            history: this.history,
            round: this.totalRound,
            auto: this.gameMode == GameMode.Auto,
            profit: math.toFixedNumber(this.profit),
            profitMinusIndex: math.toFixedNumber(this.profitMinusIndex),
            rank: playerRank,
        };
        let postData = {
            user: director.user.isLogin ? director.user.name : "",
            level: this.numTracks,
            value: math.toFixedNumber(this.profit),
            valueminusindex: math.toFixedNumber(this.profitMinusIndex),
            data: JSON.stringify(resData),
            rank: playerRank
        }
        return postData;
    }

    gameOverTracker() {
        director.tracker.event({
            cat: 'game',
            action: 'over',
            label: 'score',
            value: this.profit
        });
        director.tracker.event({
            cat: 'game',
            action: 'over',
            label: 'time',
            value: this.gameTime
        });
        director.tracker.event({
            name: 'Game Over',
            properties: {
                'Level': this.numTracks,
                'Mode': this.gameMode,
                'User': director.user.isLogin ? director.user.name : ""
            },
            measurements: {
                'Profit': this.profit,
                'ProfitMinusIndex': this.profitMinusIndex,
                'Time': this.gameTime,
                'Rank': this.playerRank
            }
        });
    }

    get gameTime(): number {
        return this.history[this.history.length - 1].time;
    }

    get profit(): number {
        // return this.tracks[0].profit;
        return (this.totalAmount / START_CASH) * 100 - 100;
    }

    get profitMinusIndex(): number {
        // return this.tracks[0].profit;
        return this.profit - this.tracks[this.tracks.length - 1].profit;
    }

    sell() {
        if (this.stockPosition != undefined) {
            this.cash = this.stockPosition.track.price * this.stockPosition.amount;
            this.stockPosition = undefined;
        }
    }

    buy(track: CandleTrack) {
        if (track == this.tracks[0]) return;
        this.sell();
        if (this.stockPosition == undefined) {
            this.stockPosition = {
                track: track,
                amount: this.cash / track.price
            };
            this.cash = 0;
        }
    }

    unfocus() {
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].focus = false;
        }
    }

    onTrackClick(track) {
        if (!this.enabled) return;
        this.enabled = false;
        this.unfocus();
        track.focus = true;
        this.focusTrack = track;
        this.sell();
        this.buy(track);
        this.renderFrontAxis();
        if (this.gameMode == GameMode.Normal || this.gameMode == GameMode.Match)
            this.next();
    }

    startLoading() {
        if (this.loadingPanel == undefined) {
            this.loadingPanel = new PIXI.Container();
            let r = graphic.rectangle(director.config.width, director.config.height, 0);
            r.alpha = 0.7;
            let l = new Label('加载中...', { align: 'left', fontSize: 25 });
            this.loadingPanel.addChild(r);
            this.loadingPanel.addChild(l);
            l.position.set(260, 430);
        }
        this.loadingPanel.interactive = true;
        this.addChild(this.loadingPanel);
    }

    stopLoading() {
        if (this.loadingPanel)
            this.removeChild(this.loadingPanel);
    }
}
