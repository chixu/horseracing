import { Candle, CandleOption } from "./candle";
import { RectButton } from "../core/component/rectButton";
import { Label } from "../core/component/label";
// import * as director from "../core/director";
import { MainScene } from "../mainScene";
import * as math from "../utils/math";
import * as array from "../utils/array";
import * as graphic from "../utils/graphic";

export class CandleTrack extends PIXI.Container {
    // container;
    candle: Candle;
    protected _focus: boolean = false;
    candleContainer: PIXI.Container;
    button: RectButton;
    // star: PIXI.Sprite;
    //buttonText: Label;
    datas = [];
    dataIndex: number;
    // static origDataIndex: number;
    min: number;
    max: number;
    open: number;
    close: number;
    mainScene: MainScene;
    index: number;
    numHistoryPoints;
    lineColor = 0xff0000;
    btnColor;
    historyMax: number;
    historyMin: number;
    static readonly colors = [0xFF3333, 0xFFAEFD, 0xFFCC00, 0x9900FF, 0x0033CC, 0xFFFF33, 0x00FFFF, 0x33CC33, 0x990000]
    //dark blue 0x0033CC
    //brown 990000
    stockName: string;
    startDate: Date;
    endDate: Date;
    // static dataDates: number[];
    // parsedData: any[];

    constructor(mainScene: MainScene, index: number = 0) {
        super();
        // CandleTrack.origDataIndex = undefined;
        // CandleTrack.dataDates = undefined;
        this.mainScene = mainScene;
        this.numHistoryPoints = mainScene.numHistoryPoints;
        this.index = index;
        this.lineColor = this.btnColor = CandleTrack.colors[index];
        this.candleContainer = new PIXI.Container;
        this.addChild(this.candleContainer);
        // this.star = new PIXI.Sprite(director.resourceManager.texture('star'));
        // this.addChild(this.star);
        // this.star.pivot.set(this.star.width / 2, this.star.height / 2);
        // this.star.scale.set(0.4, 0.4);
        // this.star.y = -200;
        let buttonW = [120, 120, 120, 96, 80, 68][mainScene.numTracks - 1];
        let clickedArea = graphic.rectangle(buttonW, 420, 0xff0000);
        clickedArea.alpha = 0;
        this.button = new RectButton(buttonW, 60, CandleTrack.colors[index]);
        this.button.y = 300;
        this.button.clickHandler = () => {
            this.mainScene.onTrackClick(this);
        }
        this.button.text = '多';
        clickedArea.position.set(-buttonW * .5, -450);
        this.button.addChild(clickedArea);
        this.focus = false;
        this.addChild(this.button);
    }

    get profit(): number {
        return this.getRelativePercent(this.close);
    }

    clearData() {
        this.min = undefined;
        this.max = undefined;
        this.open = undefined;
        this.close = undefined;
        this.dataIndex = this.numHistoryPoints - 1;
        this.focus = false;
    }

    setDatas(d?: any[], name?: string) {
        this.datas = d;
        // let numPts = this.numHistoryPoints + this.mainScene.totalRound;
        // if (CandleTrack.origDataIndex == undefined)
        //     CandleTrack.origDataIndex = math.randomInteger(1, d.length - numPts);
        // this.dataIndex = this.numHistoryPoints - 1;
        // let dates = [];
        // for (let i = 0; i < numPts; i++) {
        //     dates.push(d[CandleTrack.origDataIndex + i][0]);
        // }
        // if (CandleTrack.dataDates) {
        //     let startDate = CandleTrack.dataDates[0];
        //     let endDate = CandleTrack.dataDates[CandleTrack.dataDates.length - 1];
        //     for (let i = 0; i < d.length; i++) {
        //         let date = d[i];
        //         if (startDate < date && date < endDate && CandleTrack.dataDates.indexOf(date) == -1) {
        //             array.insertAsc(CandleTrack.dataDates, date);
        //         }
        //     }
        // } else {
        //     CandleTrack.dataDates = dates;
        // }
        // this.dataIndex = 10;
        // this.nextData();
        // this.dataIndex += this.numHistoryPoints;
        // this.origDataIndex = this.dataIndex;
        this.stockName = name;
        // console.log(CandleTrack.dataDates.length, CandleTrack.dataDates);
    }

    // getDataByDate(date) {
    //     for (let i = this.datas.length - 1; i >= 0; i--) {
    //         let d = this.datas[i];
    //         if (d[0] <= date)
    //             return d;
    //     }
    //     return this.datas[0];
    // }

    // initData() {
    //     if (this.parsedData == undefined) {
    //         this.parsedData = [];
    //         for (let i = 0; i < CandleTrack.dataDates.length; i++) {
    //             this.parsedData.push(this.getDataByDate(CandleTrack.dataDates[i]));
    //         }
    //     }
    //     // console.log(this.parsedData);
    // }

    nextData() {
        this.dataIndex++;
        // this.initData();
        // console.log(this.dataIndex);
        let d = this.datas[this.dataIndex];
        //初始值是前一天收盘价
        if (this.open == undefined) {
            this.open = d[5];
            this.startDate = new Date(d[0]);
        }
        // let min = this.getRelativePercent(d[4]);
        // if (this.min == undefined)
        //     this.min = min;
        // else
        //     this.min = Math.min(min, this.min);
        // let max = this.getRelativePercent(d[3]);
        // if (this.max == undefined)
        //     this.max = max;
        // else
        //     this.max = Math.max(max, this.max);
        this.close = d[5];
        this.endDate = new Date(d[0]);
        // console.log('nextData', this.index, this.min, this.max);
        // this.candle.setPosition(1);
        let hmax = this.close, hmin = this.close;
        for (let i = 1; i < this.numHistoryPoints; i++) {
            let n = this.datas[this.dataIndex - i][5];
            if (hmax < n) hmax = n;
            if (hmin > n) hmin = n;
        }
        this.historyMax = this.getRelativePercent(hmax);
        this.historyMin = this.getRelativePercent(hmin);
    }

    getRelativePercent(v) {
        return v / this.open * 100 - 100;
    }

    renderLine() {
        let pts = []
        for (let i = this.numHistoryPoints - 1; i >= 0; i--) {
            pts.push(this.getRelativePercent(this.datas[this.dataIndex - i][5]));
        }
        this.mainScene.sideAxis.renderPoints(pts, this.lineColor);
    }

    renderCandle() {
        let d = this.datas[this.dataIndex];
        // this.candle = this.mainScene.axis.addCandle({
        //     min: this.min,
        //     open: d[2] / this.open * 100 - 100,
        //     close: d[5] / this.open * 100 - 100,
        //     max: this.max,
        // }, this.index);
        this.candle = new Candle({
            min: this.historyMin,
            open: this.getRelativePercent(d[2]),
            close: this.getRelativePercent(d[5]),
            max: this.historyMax,
            heightRatio: this.mainScene.axis.heightRatio,
            barColor: this.lineColor,
            type: MainScene.renderHorse ? (this.focus ? 'rider' : 'horse') : 'kline'
        });
        // console.log(this.min, this.max, d[2] / this.open * 100 - 100, d[5] / this.open * 100 - 100);
        //this.graphContainer.addChild(candle);
        this.candle.x = (-this.mainScene.numTracks / 2 + this.index) * this.mainScene.trackGap;
        // candle.y = this.zeroPosition;
        this.mainScene.axis.addCandle(this.candle);
    }

    get price(): number {
        return this.close;
    }

    get focus(): boolean {
        return this._focus;
    }

    set focus(b: boolean) {
        this._focus = b;
        // this.button.text = b ? '卖' : '买';
        // if (b)
        //     this.button.renderBorder(0xffffff, 3);
        // else
        //     this.button.removeBorder();
        // this.star.visible = b;
    }

    showButton(b: boolean) {
        this.button.visible = b;
    }

}
