import { Label } from "./label";
import * as director from "../director"

export class ToggleButton extends PIXI.Container {
    private _selected: boolean;
    private _top: PIXI.Container;
    private _up: PIXI.Container;
    private _down: PIXI.Container;
    clickHandler: any;

    constructor() {
        super();
        this.buttonMode = true;
        this.interactive = true;
        this
            // .on('mousedown', this.buttonDownHandler)
            // .on('touchstart', this.buttonDownHandler)
            // .on('mouseup', this.buttonUpHandler)
            // .on('touchend', this.buttonUpHandler)
            // .on('mouseupoutside', this.buttonUpHandler)
            // .on('touchendoutside', this.buttonUpHandler)
            .on("click", this.buttonClickedHandler)
            .on("tap", this.buttonClickedHandler)
            ;
    }

    private arrage() {
        if (this.down) this.addChild(this.down);
        if (this.up) this.addChild(this.up);
        if (this.top) this.addChild(this.top);
    }

    set top(value: PIXI.Container) {
        this._top = value;
        this.arrage();
    }

    get top(): PIXI.Container {
        return this._top;
    }

    set up(value: PIXI.Container) {
        this._up = value;
        this.arrage();
    }

    get up(): PIXI.Container {
        return this._up;
    }

    set down(value: PIXI.Container) {
        this._down = value;
        this.arrage();
    }

    get down(): PIXI.Container {
        return this._down;
    }

    private buttonClickedHandler() {
        this.selected = !this._selected;
        if (this.clickHandler) {
            this.clickHandler();
        }
    }

    private buttonUpOutsideHandler() {
    }

    set selected(value: boolean) {
        this._selected = value;
        if (this.down) this.down.visible = value;
        if (this.up) this.up.visible = !value;
    }

    get selected(): boolean {
        return this._selected;
    }
}
