import { Label } from "../core/component/label";
import { RectButton } from "../core/component/rectButton";
import { Candle, CandleOption } from "./candle";
import { MainScene } from "../mainScene";

export type AxisOption = {
    percent: boolean,
    max: number,
    min: number,
    height: number,
    width: number,
    lineWidth?: number,
    color?: number
}

export class Axis extends PIXI.Container {
    // container;
    option: AxisOption;
    axisContainer: PIXI.Container;
    graphContainer: PIXI.Container;
    playersContainer: PIXI.Container;
    zeroPosition: number;
    lineGap: number;
    mainScene: MainScene;
    heightRatio: number;


    constructor(opt: AxisOption, scene: MainScene) {
        super();
        this.mainScene = scene;
        this.axisContainer = new PIXI.Container();
        this.addChild(this.axisContainer);
        this.graphContainer = new PIXI.Container();
        this.addChild(this.graphContainer);
        this.playersContainer = new PIXI.Container();
        this.addChild(this.playersContainer);
        this.option = opt;
        // this.render(opt);
    }

    tryUnit(opt: AxisOption, unit = 5) {
        let maxSide = Math.max(Math.abs(opt.max), Math.abs(opt.min));
        let minSide = Math.min(Math.abs(opt.max), Math.abs(opt.min));
        let maxUnit = Math.max(Math.ceil((maxSide - unit * 0.3) / unit), 1);
        if (opt.max * opt.min < 0) {
            let minUnit = Math.max(Math.ceil((minSide - unit * 0.3) / unit), 1);
            if (maxSide == opt.max)
                return { top: maxUnit, btm: -minUnit };
            else
                return { top: minUnit, btm: -maxUnit };
        } else {
            if (opt.max == maxSide) {
                return { top: maxUnit, btm: -1 };
            } else {
                return { top: 1, btm: -maxUnit };
            }
        }
    }

    clearGraph() {
        this.graphContainer.removeChildren();
    }

    addCandle(candle: Candle) {
        // console.log(opt.open, opt.close, opt.min, opt.max);
        // let candle = new Candle(opt);
        // this.graphContainer.addChild(candle);
        // candle.x = (-(this.mainScene.numTracks - 1) / 2 + idx) * this.mainScene.trackGap;
        // candle.y = this.zeroPosition;
        // return candle
        this.graphContainer.addChild(candle);
        candle.y = this.zeroPosition;
    }

    renderPoints(pts: number[], color: number, lineWidth = 2) {
        let l = new PIXI.Graphics();
        l.lineStyle(lineWidth, color);
        let gap = this.option.width / pts.length * 0.85;
        l.moveTo(0, -this.heightRatio * pts[0]);
        for (let i = 1; i < pts.length; i++) {
            l.lineTo(i * gap, -this.heightRatio * pts[i]);
        }
        l.x = -this.option.width * 0.45;
        l.y = this.zeroPosition;
        this.graphContainer.addChild(l);
    }

    render(min: number, max: number) {
        this.option.max = max;
        this.option.min = min;
        this.render2(this.option);
    }



    renderPlayers(d) {
        this.playersContainer.removeChildren();
        // d = d || this.mainScene.playersData;
        for (let i = 0; i < d.length; i++) {
            this.renderPlayer(d[i].n, d[i].s, 0x00ff00);
        }
        this.renderPlayer('你', this.mainScene.profit, 0xff0000);
    }

    private renderPlayer(name, score, color) {
        let x = this.option.width / 2;
        let b = new RectButton(60, 20, color);
        b.textHeight = 16;
        b.text = name;
        b.y = -this.heightRatio * score + this.zeroPosition;
        b.x = x + 20;
        b.alpha = 0.7;
        this.playersContainer.addChild(b);
    }

    private render2(opt: AxisOption) {
        this.axisContainer.removeChildren();
        let unit = 5;
        let unitRes = this.tryUnit(opt, unit);
        while (unitRes.top - unitRes.btm > 5) {
            unit *= 2;
            unitRes = this.tryUnit(opt, unit);
        }
        // console.log(unitRes);
        let lineWidth = opt.lineWidth || 1;
        let color = opt.color == undefined ? 0xffffff : opt.color;
        let lines = unitRes.top - unitRes.btm + 1;
        let topLine = unitRes.top * unit;
        let lGap = opt.height / (unitRes.top - unitRes.btm);
        this.lineGap = lGap;
        this.zeroPosition = lGap * unitRes.top;
        this.heightRatio = lGap / unit;
        let l = new PIXI.Graphics();
        l.lineStyle(lineWidth, color);
        for (let i = 0; i < lines; i++) {
            l.moveTo(-opt.width / 2, i * lGap);
            l.lineTo(opt.width / 2, i * lGap);
            let t = new Label(topLine.toString() + (opt.percent ? "%" : ""), { fontSize: 14 });
            t.position.set(-opt.width / 2 - 20, i * lGap);
            this.axisContainer.addChild(t);
            topLine -= unit;
        }
        this.axisContainer.addChild(l);

    }

}