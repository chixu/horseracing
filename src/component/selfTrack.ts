import { Candle, CandleOption } from "./candle";
import { RectButton } from "../core/component/rectButton";
import { Label } from "../core/component/label";
// import * as director from "../core/director";
import { MainScene, START_CASH } from "../mainScene";
import { CandleTrack } from "./candleTrack";
import * as math from "../utils/math";
import { num } from "../utils/xml";

export class SelfTrack extends CandleTrack {
    prev = 0;
    color;

    constructor(mainScene: MainScene) {
        super(mainScene);
        // this.button.rect.tint = b ? 0x00ff00 : 0xff0000;
        this.button.text = '空';
        this.button.clickHandler = () => {
            this.mainScene.onTrackClick(this);
        }
    }

    // get profit(): number {
    //     return this.close;
    // }

    setDatas(d) {
        this.datas = [];
        for (let i = 0; i < this.numHistoryPoints; i++) {
            this.datas.push(0);
        }
        this.dataIndex = this.numHistoryPoints - 1;
    }

    clearData() {
        this.prev = this.min = this.max = this.open = 0;
        this.datas = [];
        for (let i = 0; i < this.numHistoryPoints; i++) {
            this.datas.push(0);
        }
        this.dataIndex = this.numHistoryPoints - 1;
        this.focus = true;
    }

    nextData() {
        this.dataIndex++;
        let percent = (this.mainScene.totalAmount / START_CASH) * 100 - 100;
        this.open = this.close = percent;
        this.datas.push(percent);
        this.min = Math.min(this.open, this.min);
        this.max = Math.max(this.open, this.max);
        if (this.prev == this.open)
            this.color = 0xffffff;
        else if (this.prev < this.open)
            this.color = Candle.incColor;
        else
            this.color = Candle.decColor;
        this.prev = this.open;
        let hmax = this.open, hmin = this.open;
        for (let i = 1; i < this.numHistoryPoints; i++) {
            let n = this.datas[this.dataIndex - i];
            if (hmax < n) hmax = n;
            if (hmin > n) hmin = n;
        }
        this.historyMax = hmax;
        this.historyMin = hmin;
    }

    renderLine() {
        let pts = []
        for (let i = this.numHistoryPoints - 1; i >= 0; i--) {
            pts.push(this.datas[this.dataIndex - i]);
        }
        this.mainScene.sideAxis.renderPoints(pts, this.lineColor);
    }

    getRelativePercent(v) {
        return v;
    }

    renderCandle() {
        this.candle = new Candle({
            min: this.min,
            open: this.open,
            close: this.open,
            max: this.max,
            type: MainScene.renderHorse ? (this.focus ? 'rider' : 'horse') : 'circle',
            color: this.color,
            barColor: this.color,
            heightRatio: this.mainScene.axis.heightRatio
        });
        // console.log(this.min, this.max, this.open);
        this.candle.x = (-this.mainScene.numTracks / 2 + this.index) * this.mainScene.trackGap;
        this.mainScene.axis.addCandle(this.candle);
    }
    // get price(): number {
    //     return (this.candle.data.close / 100 + 1) * this.open;
    // }

    get focus(): boolean {
        return this._focus;
    }

    set focus(b: boolean) {
        this._focus = b;
        // if (b)
        //     this.button.renderBorder(0xffffff, 3);
        // else
        //     this.button.removeBorder();
    }
}

// Object.defineProperty(SelfTrack.prototype, "profit", {
//     get: function () {
//         return this.close;
//     }
// });
