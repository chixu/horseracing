import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import { CandleTrack } from "./component/candleTrack";
import { Axis } from "./component/axis";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/RectButton";
import * as http from "./utils/http";
import * as date from "./utils/date";
import * as graphic from "./utils/graphic";
import { SelectionScene } from "./selectionScene";
import * as math from "./utils/math";
import * as array from "./utils/array";
import { SelfTrack } from "./component/selfTrack";
import { SinglePlayerScene } from "./singlePlayerScene";
// import $ from "jquery";
export const START_CASH = 100000;

export class MainScene extends Scene {
    // container;
    tracks: CandleTrack[];
    focusTrack: CandleTrack;
    tracksWidth;
    trackGap: number;
    numTracks;
    scoreLabel: Label;
    cash: number;
    stockPosition: { track: CandleTrack, amount: number };
    closePrice = 10;
    // skipButton: RectButton;
    round: number;
    readonly totalRound: number = 25;
    axis: Axis;
    sideAxis: Axis;
    winPanel: PIXI.Container;
    //inited: boolean = false;
    static renderHorse = true;

    constructor(num) {
        super();
        this.numTracks = num;
        this.scoreLabel = new Label('', { align: 'left', fontSize: 25 });
        this.scoreLabel.position.set(5, 5);
        this.addChild(this.scoreLabel);

        let horseButton = new RectButton(120, 40, 0x0000ff);
        horseButton.text = MainScene.renderHorse ? "显示K线" : "显示赛马";
        horseButton.position.set(director.config.width - 60, 20)
        horseButton.clickHandler = () => {
            console.log(horseButton.text);
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

        // this.skipButton = new RectButton(120, 60, 0x0000ff);
        // this.skipButton.position.set(300, 800);
        // this.skipButton.clickHandler = () => {
        //     this.next();
        // }
        // this.skipButton.text = '观望';
        // this.addChild(this.skipButton);
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
        this.init();
    }

    getData() {
        let stockids = ['000002', '000651', '600519', '600690', '600887', '601398', '601857', '601988'];
        //let url = "https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SZ000651&begin=1512576000000&period=day&type=before&count=-142";
        // console.log(math.randomArray(stockids));
        stockids = math.randomArray(stockids)
        let promise: Promise<any> = Promise.resolve();
        let datas = {};
        for (let i = 0; i < this.numTracks; i++) {
            console.log(`/data/${stockids[i]}.json`);
            promise = promise.then(() => {
                return http.get(`/data/${stockids[i]}.json`).then(data => {
                    let d = JSON.parse(data);
                    // datas.push(d.data.item);
                    datas[d.data.symbol] = d.data.item;
                });
            });
        }
        return promise.then(() => {
            // for (let i = 0; i < this.tracks.length; i++) {
            //     this.tracks[i].setDatas(i == 0 ? undefined : datas[i - 1]);
            // }
            this.tracks[0].setDatas();
            let i = 0;
            for (let k in datas) {
                i++
                this.tracks[i].setDatas(datas[k], k);
            }
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
    }

    enter(args?) {
        // this.init();
    }

    init(useOldData = false) {
        this.cash = START_CASH;
        this.stockPosition = undefined;
        this.focusTrack = undefined;
        this.updateScore();
        this.round = 0;
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
        this.next();
    }

    next() {
        this.round++;
        if (this.round == this.totalRound) {
            this.gameOver();
        } else {
            let max = 0, min = 0, hmax = 0, hmin = 0;
            for (let i = this.tracks.length - 1; i >= 0; i--) {
                let track: CandleTrack = this.tracks[i];
                track.nextData();
                max = Math.max(max, track.historyMax);
                min = Math.min(min, track.historyMin);
                console.log(track.historyMin, track.historyMax)
                hmax = Math.max(hmax, track.historyMax);
                hmin = Math.min(hmin, track.historyMin);
            }
            console.log(hmin, hmax);
            this.axis.render(min, max);
            this.sideAxis.render(hmin, hmax);
            this.axis.clearGraph();
            this.sideAxis.clearGraph();
            for (let i = 0; i < this.tracks.length; i++) {
                this.tracks[i].renderCandle();
                this.tracks[i].renderLine();
            }
            this.updateScore();
        }
    }

    gameOver() {
        if (this.winPanel == undefined) {
            this.winPanel = new PIXI.Container;
        }
        this.addChild(this.winPanel);
        this.winPanel.removeChildren();
        let rect = graphic.rectangle(director.config.width, director.config.height);
        this.winPanel.addChild(rect);
        rect.interactive = true;
        rect.alpha = 0.7;


        let replay = new RectButton(180, 60, 0x00ff00);
        replay.text = "重玩";
        replay.position.set(director.config.width / 2, 670);
        replay.clickHandler = () => {
            this.removeChild(this.winPanel);
            this.init(true);
        }
        this.winPanel.addChild(replay);
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

        let l1 = new Label("恭喜你", { fontSize: 50 });
        this.winPanel.addChild(l1);
        l1.position.set(director.config.width / 2, 50);
        let percent = this.totalAmount / START_CASH - 1;
        // console.log('percent', percent);
        //let l2 = new Label(`您最后的收益率为${(percent * 100).toFixed(2)}%\n击败了${(1 / (1 + Math.pow(2, -30 * percent)) * 100).toFixed(2)}%的玩家`, { fontSize: 40 });


        let rank = '';
        let playerRank;
        let sortedTracks = array.sortDesc(this.tracks, 'profit');
        for (let i = 0; i < sortedTracks.length; i++) {

            console.log(sortedTracks[i].profit);
            let t: CandleTrack = sortedTracks[i]
            let name = t.stockName || '玩家';
            let d = '';
            if (t.stockName) {
                d = '(' + date.dateToYYmmdd(t.startDate) + '-' + date.dateToYYmmdd(t.endDate) + ')';
            } else {
                playerRank = i + 1;
            }
            rank += (i + 1) + '. ' + name + d + '  ' + t.profit.toFixed(2) + '%\n';
        }
        console.log(rank);
        let l3 = new Label(rank, { fontSize: 30 });
        this.winPanel.addChild(l3);
        l3.position.set(director.config.width / 2, 410);

        let l2 = new Label(`您最后的收益率为${(percent * 100).toFixed(2)}%\n排名第${playerRank}`, { fontSize: 40 });
        this.winPanel.addChild(l2);
        l2.position.set(director.config.width / 2, 170);

        if (playerRank == 1) {
            director.user.unlockedLevel++;
            if (director.user.unlockedLevel <= SinglePlayerScene.totalLevel) {
                let next = new RectButton(180, 60, 0x00ff00);
                next.text = "下一关";
                next.position.set(director.config.width / 2, 580);
                next.clickHandler = () => {
                    director.sceneManager.replace(new MainScene(director.user.unlockedLevel));
                }
                this.winPanel.addChild(next);
            }
        }
        // for (let i = 0; i < this.tracks.length; i++) {
        //     console.log(this.tracks[i].profit);
        // }
    }

    sell() {
        if (this.stockPosition != undefined) {
            this.cash = this.stockPosition.track.price * this.stockPosition.amount;
            this.stockPosition = undefined;
        }
    }

    buy(track: CandleTrack) {
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
        // this.unfocus();
        // if (this.focusTrack) {
        //     if (this.focusTrack == track) {
        //         track.focus = false;
        //         this.focusTrack = undefined;
        //         this.sell();
        //     } else {
        //         this.focusTrack.focus = false;
        //         track.focus = true;
        //         this.focusTrack = track;
        //         this.buy(track);
        //     }
        // } else {
        //     track.focus = true;
        //     this.focusTrack = track;
        //     this.buy(track);
        // }
        this.unfocus();
        track.focus = true;
        this.sell();
        this.buy(track);
        this.next();
    }
}
