import { Label } from "./label";
import * as graphic from "../../utils/graphic"

export class RectButton extends PIXI.Container {
    // container;
    rect: PIXI.Graphics;
    _enabled: boolean = true;
    downHandler;
    upHandler;
    clickHandler;
    label: Label;
    border: PIXI.Graphics;
    textHeight: number;
    shortClick: number = 0;
    downTimer: number

    constructor(w, h, color = 0xffffff) {
        super();
        let rect = new PIXI.Graphics();
        rect.beginFill(color);
        rect.drawRect(0, 0, w, h);
        rect.position.set(-w / 2, -h / 2);
        this.addChild(rect);
        this.rect = rect;
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
        // this._enabled = true;
    }

    removeBorder() {
        if (this.border != undefined) this.removeChild(this.border);
    }

    renderBorder(color: number, line = 1) {
        this.removeBorder();
        let w = this.rect.width, h = this.rect.height;
        let l = graphic.rectBorder(w, h, color, line);
        l.position.set(-w / 2, -h / 2);
        this.addChild(l);
        this.border = l;
    }

    render(color: number, text?: string) {
        let w = this.rect.width, h = this.rect.height;
        this.removeChild(this.rect);
        this.rect = graphic.rectangle(w, h, color);
        this.rect.position.set(-w / 2, -h / 2);
        this.addChildAt(this.rect, 0);
        if (text != undefined)
            this.text = text;
    }

    get text(): string {
        if (this.label == undefined)
            return "";
        else
            return this.label.value;
    }

    set text(v: string) {
        if (this.label == undefined) {
            this.label = new Label("", { fontSize: this.textHeight || this.rect.height / 2 });
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
