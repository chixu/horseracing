import { Candle, CandleOption } from "./candle";
import { RectButton } from "../core/component/rectButton";
import { Label } from "../core/component/label";
// import * as director from "../core/director";
import { MainScene } from "../mainScene";
import * as math from "../utils/math";
import * as array from "../utils/array";
import * as graphic from "../utils/graphic";

const DATE_IDX = 0;
const OPEN_IDX = 1;
const CLOSE_IDX = 2;
const MAX_IDX = 3;
const MIN_IDX = 4;

export class CandleTrack extends PIXI.Container {
    // container;
    candle: Candle;
    protected _focus: boolean = false;
    candleContainer: PIXI.Container;
    button: RectButton;
    // star: PIXI.Sprite;
    //buttonText: Label;
    datas = [];
    fullData;
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
    stockCode: string = "";
    stockName: string = "";
    startDate: Date;
    endDate: Date;
    infoPanel: PIXI.Container;
    // static dataDates: number[];
    // parsedData: any[];
    clickedArea;
    _enabled: boolean;

    constructor(mainScene: MainScene, index: number = 0) {
        super();
        // CandleTrack.origDataIndex = undefined;
        // CandleTrack.dataDates = undefined;
        this.mainScene = mainScene;
        this.numHistoryPoints = mainScene.numHistoryPoints;
        this.index = index;
        this.initUI(index);
        // this.showButton(false);
    }

    initUI(index) {
        this.lineColor = this.btnColor = CandleTrack.colors[index];
        this.candleContainer = new PIXI.Container();
        this.addChild(this.candleContainer);
        let buttonW = [120, 120, 120, 96, 80, 68][this.mainScene.numTracks - 1];
        // let clickedArea = graphic.rectangle(buttonW, 420, 0xff0000);
        let clickedArea = new RectButton(buttonW, 420, 0xff0000);
        clickedArea.alpha = 0;
        this.button = new RectButton(buttonW, 60, CandleTrack.colors[index]);
        this.button.y = 300;
        clickedArea.y = 60;
        this.button.clickHandler = clickedArea.clickHandler = () => {
            this.mainScene.onTrackClick(this);
        }
        this.button.text = '多';
        this.button.visible = false;
        this.clickedArea = clickedArea;
        this.addChild(clickedArea);
        this.focus = false;
        this.addChild(this.button);

        this.infoPanel = new PIXI.Container();
        this.addChild(this.infoPanel);
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
        if (this.infoPanel)
            this.infoPanel.removeChildren();
    }

    setDatas(d?: any, name?: string) {
        this.datas = [];
        this.fullData = d;
        for (let k in d.data) {
            this.datas.push([k].concat(array.toNumbers(d.data[k])));
        }
        // console.log(this.datas);
        if (this.infoPanel) {
            let info;
            let inc = (this.fullData.NetProfitRate * 100).toFixed(2);
            if (this.mainScene.numTracks > 4)
                info = new Label(`盈${this.fullData.pe}\n净${this.fullData.pb}\n增${inc}%\n`, { fontSize: 18, align: 'left' });
            else
                info = new Label(`市盈${this.fullData.pe}\n市净${this.fullData.pb}\n增长${inc}%\n`, { fontSize: 20, align: 'left' });
            this.infoPanel.addChild(info);
            info.position.set(-this.button.width / 2, 220);
        }
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
        this.stockCode = name;
        this.stockName = d.name;
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
            this.open = d[CLOSE_IDX];
            this.startDate = this.getDate();
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
        this.close = this.getCloseValue(this.dataIndex);
        this.endDate = this.getDate();
        // console.log('nextData', this.stockCode, this.startDate, this.endDate, this.open, this.close, this.profit);
        // this.candle.setPosition(1);
        let hmax = this.close, hmin = this.close;
        for (let i = 0; i < this.numHistoryPoints + 1; i++) {
            let n = this.getCloseValue(this.dataIndex - i);
            if (hmax < n) hmax = n;
            if (hmin > n) hmin = n;
        }
        this.historyMax = this.getRelativePercent(hmax);
        this.historyMin = this.getRelativePercent(hmin);
        // console.log(this.open, this.close, this.startDate, this.endDate);
        // console.log(this.historyMin, this.historyMax);
    }

    getCloseValue(idx) {
        let v = this.datas[idx][CLOSE_IDX];
        return v > 0 ? v : this.datas[idx][OPEN_IDX];
    }

    getDate() {
        return new Date(this.datas[this.dataIndex + 1][DATE_IDX].split(" ")[0])
    }

    getRelativePercent(v) {
        return v / this.open * 100 - 100;
    }

    renderLine() {
        let pts = []
        for (let i = this.numHistoryPoints; i >= 0; i--) {
            pts.push(this.getRelativePercent(this.getCloseValue(this.dataIndex - i)));
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
            open: this.getRelativePercent(d[OPEN_IDX]),
            close: this.getRelativePercent(this.getCloseValue(this.dataIndex)),
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

    set enabled(b: boolean) {
        this._enabled = b;
        if (this.clickedArea)
            this.clickedArea.visible = b;
    }

    showButton(b: boolean = true) {
        if (this.button)
            this.button.visible = b;
        if (this.infoPanel)
            this.infoPanel.visible = !b;
    }


    showInfo(b: boolean) {

    }

}
