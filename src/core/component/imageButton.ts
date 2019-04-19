import { Label } from "./label";
import * as graphic from "../../utils/graphic"
import * as director from "../director"


export type ImageButtonOptions = {
    src: string,
    text?: string,
    textX?: number,
    textY?: number,
    textHeight?: number
}


export class ImageButton extends PIXI.Container {
    // container;
    bg: PIXI.Sprite;
    _enabled: boolean = true;
    downHandler;
    upHandler;
    clickHandler;
    label: Label;
    textHeight: number;
    shortClick: number = 0;
    downTimer: number

    constructor(options: ImageButtonOptions) {
        super();
        this.bg = director.resourceManager.createImage(options.src);
        this.addChild(this.bg);
        this.buttonMode = true;
        this.interactive = true;
        this.on('mousedown', this.buttonDownHandler)
            .on('touchstart', this.buttonDownHandler)
            .on('mouseup', this.buttonUpHandler)
            .on('touchend', this.buttonUpHandler)
            .on('mouseupoutside', this.buttonUpHandler)
            .on('touchendoutside', this.buttonUpHandler)
            .on("click", this.buttonClickedHandler)
            .on("tap", this.buttonClickedHandler)
            ;
        if (options.textHeight) this.textHeight = options.textHeight;
        if (options.text) {
            this.text = options.text;
            if (options.textX) this.label.x = options.textX;
            if (options.textY) this.label.y = options.textY;
        }
    }

    get text(): string {
        if (this.label == undefined)
            return "";
        else
            return this.label.value;
    }

    set text(v: string) {
        if (this.label == undefined) {
            this.label = new Label("", { fontSize: this.textHeight || this.bg.height / 2 });
            this.addChild(this.label);
        }
        this.label.value = v;
    }

    private buttonDownHandler(e) {
        if (!this._enabled) return;
        this.downTimer = (new Date()).getTime();
        if (this.downHandler)
            this.downHandler(this);
    }

    private buttonUpHandler(e) {
        if (!this._enabled) return;
        if (this.upHandler)
            this.upHandler(this);
    }

    private buttonClickedHandler(e) {
        if (!this._enabled) return;
        if (this.shortClick > 0 && this.shortClick < (new Date()).getTime() - this.downTimer) return;
        if (this.clickHandler)
            this.clickHandler(this);
    }
}
