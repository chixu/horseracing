import * as graphic from "../utils/graphic";
import * as director from "../core/director";

export type CandleOption = {
    open: number,
    close: number,
    max: number,
    min: number,
    type?: string,
    color?: number,
    heightRatio: number,
    barColor?: number
}



export class Candle extends PIXI.Container {
    // container;
    public static width = 24;
    //public static heightRatio = 10000;
    public static incColor = 0xff0000;
    public static decColor = 0x00ff00;
    public static lineWidth = 2;

    data: CandleOption;
    color;
    centerValue;
    constructor(d: CandleOption) {
        super();
        this.data = d;
        this.centerValue = (d.open + d.close) / 2;
        if (d.type == 'circle') {
            this.renderCircle();
        } else if (d.type == 'horse') {
            this.renderHorse();
        } else if (d.type == 'rider') {
            this.renderRider();
        } else {
            this.renderCandle();
        }
    }

    renderCandle() {
        let d = this.data;
        this.color = d.open > d.close ? Candle.decColor : Candle.incColor;
        let barColor = d.barColor == undefined ? this.color : d.barColor;
        // this.container = new PIXI.Container();
        //let yAdjust = - this.centerValue * Candle.heightRatio;
        let r = d.heightRatio;
        if (d.open > d.close) {
            let rect = new PIXI.Graphics();
            rect.beginFill(this.color);
            let h = Math.ceil(r * (d.open - d.close));
            rect.drawRect(-Candle.width / 2, -d.open * r, Candle.width, h);
            // rect.x = -Candle.width / 2;
            // rect.y = -h / 2 + yAdjust;

            let l = new PIXI.Graphics();
            l.lineStyle(Candle.lineWidth + 1, barColor);
            l.moveTo(0, -d.max * r);
            l.lineTo(0, - d.min * r);
            this.addChild(l);
            this.addChild(rect);

        } else {
            // let rectH = d.close - d.open;
            // let halfRectH = rectH / 2;
            let l = new PIXI.Graphics();
            l.lineStyle(Candle.lineWidth, this.color);
            let l2 = new PIXI.Graphics();
            l2.lineStyle(Candle.lineWidth + 1, barColor);

            l2.moveTo(0, -d.max * r);
            l2.lineTo(0, -d.close * r);
            if (d.close == d.open) {
                l.moveTo(-Candle.width / 2, -d.close * r);
                l.lineTo(Candle.width / 2, -d.close * r);
            } else {
                // l.(-Candle.width / 2, 0);
                l.moveTo(-Candle.width / 2, r * -d.close);
                l.lineTo(-Candle.width / 2, r * -d.open);
                l.lineTo(Candle.width / 2, r * -d.open);
                l.lineTo(Candle.width / 2, r * -d.close);
                l.lineTo(-Candle.width / 2, r * -d.close);
            }
            l2.moveTo(0, r * -d.open);
            l2.lineTo(0, r * - d.min);
            // l.y = yAdjust;
            this.addChild(l2);
            this.addChild(l);
        }
    }

    renderCircle() {
        let d = this.data;
        let color = d.color == undefined ? 0xffffff : d.color;
        let r = d.heightRatio;
        let l = new PIXI.Graphics();
        l.lineStyle(Candle.lineWidth, color);
        l.moveTo(0, -d.max * r);
        l.lineTo(0, -d.min * r);
        this.addChild(l);
        let circle = graphic.circle(Candle.width / 2, color);
        this.addChild(circle);
        circle.y = -d.close * r;
    }

    renderBar() {
        let d = this.data;
        let barColor = d.barColor == undefined ? this.color : d.barColor;
        let r = d.heightRatio;
        let l = new PIXI.Graphics();
        l.lineStyle(Candle.lineWidth + 1, barColor);
        l.moveTo(0, -d.max * r);
        l.lineTo(0, - d.min * r);
        this.addChild(l);
    }

    // renderHorse() {
    //     let d = this.data;
    //     this.renderBar();
    //     let textures = director.resourceManager.atlas('horse');
    //     let animator: any = new PIXI.extras['AnimatedSprite'](textures.slice(24, 28));
    //     animator.animationSpeed = 0.2;
    //     animator.gotoAndPlay(0);
    //     let scale = 1.3;
    //     animator.scale.set(scale, scale);
    //     animator.position.set(-animator.width / 2, -d.heightRatio * d.close - animator.height / 2);
    //     this.addChild(animator);
    // }

    // renderRider() {
    //     let d = this.data;
    //     this.renderBar();
    //     let textures = director.resourceManager.atlas('rider');
    //     let animator: any = new PIXI.extras['AnimatedSprite'](textures.slice(12));
    //     animator.animationSpeed = 0.2;
    //     let scale = 1.2;
    //     animator.scale.set(scale, scale);
    //     animator.position.set(-animator.width / 2, -d.heightRatio * d.close - animator.height / 2 - 4);
    //     animator.gotoAndPlay(0);
    //     this.addChild(animator);
    // }

    renderHorse() {
        let d = this.data;
        this.renderBar();
        let horse = director.resourceManager.createImage('horse.png');
        // let scale = 1.3;
        // horse.scale.set(scale, scale);
        horse.position.set(-horse.width / 2, -d.heightRatio * d.close - horse.height / 2);
        this.addChild(horse);
    }

    renderRider() {
        let d = this.data;
        this.renderBar();
        let horse = director.resourceManager.createImage('horse2.png');
        // let scale = 1.2;
        // horse.scale.set(scale, scale);
        horse.position.set(-horse.width / 2, -d.heightRatio * d.close - horse.height / 2 - 4);
        this.addChild(horse);
    }
}
