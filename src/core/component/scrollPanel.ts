import * as graphic from "../../utils/graphic"
import * as math from "../../utils/math"
import * as director from "../director";

export class ScrollPanel extends PIXI.Container {
    // container;
    rect: PIXI.Graphics;
    _enabled: boolean = true;
    // downHandler;
    // upHandler;
    // clickHandler;
    private _isDown: boolean = false;
    private itemsContainer: PIXI.Container;
    private scrollBar: PIXI.Sprite;
    private scrollBarBg: PIXI.Sprite;
    private maskSprite: PIXI.Graphics;
    private panelHeight: number;
    private panelWidth: number;
    private touchDownY: number;
    private touchDownContainerY: number;
    private itemsHeight: number;

    constructor(w, h) {
        super();
        this.panelHeight = this.itemsHeight = h;
        this.panelWidth = w;
        this.rect = graphic.rectangle(w, h, 0xffffff);
        this.maskSprite = graphic.rectangle(w, h, 0xffffff);
        this.rect.alpha = 0.1;
        this.addChild(this.rect);
        this.addChild(this.maskSprite);
        this.mask = this.maskSprite;
        this.itemsContainer = new PIXI.Container();
        this.addChild(this.itemsContainer);
        // this.buttonMode = true;
        this.interactive = true;
        this.on('mousedown', this.downHandler)
            .on('touchstart', this.downHandler)
            .on('mouseup', this.upHandler)
            .on('touchend', this.upHandler)
            .on('mouseupoutside', this.upHandler)
            .on('touchendoutside', this.upHandler)
            .on("touchmove", this.moveHandler)
            .on("mousemove", this.moveHandler);
        // .on("click", this.buttonClickedHandler)
        // .on("tap", this.buttonClickedHandler)
        ;
        // director.addUpdate(this);
    }

    public moveHandler(e) {
        if (!this._enabled || !this._isDown || !this.scrollBar) return;
        let y = e.data.getLocalPosition(this, e.data.global).y;
        this.itemsContainer.y =
            math.clamp(y - this.touchDownY + this.touchDownContainerY, this.panelHeight - this.itemsHeight, 0);
        // console.log('scrolling');
        this.updateScrollBar();
    }

    private get hasScrollBar(): boolean {
        return this.itemsHeight > this.panelHeight;
    }

    private setScrollBar() {
        this.removeChild(this.scrollBar);
        this.removeChild(this.scrollBarBg);
        if (this.hasScrollBar) {
            // this.scrollBar = graphic.rectangle(10, this.panelHeight * this.panelHeight / this.itemsHeight, 0xffffff);
            this.scrollBarBg = director.resourceManager.createImage('scroll_bar_bg.png');
            this.scrollBar = director.resourceManager.createImage('scroll_bar.png');
            this.scrollBar.height = this.panelHeight * this.panelHeight / this.itemsHeight;
            this.scrollBarBg.height = this.panelHeight;
            this.scrollBarBg.position.set(this.panelWidth - this.scrollBar.width/2, 0);
            this.scrollBar.position.set(this.panelWidth - this.scrollBar.width, 0);
            this.addChild(this.scrollBarBg);
            this.addChild(this.scrollBar);
        }
    }

    private updateScrollBar() {
        if (this.hasScrollBar) {
            this.scrollBar.y = -this.itemsContainer.y / this.itemsHeight * this.panelHeight;
        }
    }

    public addItem(item) {
        this.itemsContainer.addChild(item);
        this.setScrollBar();
        this.itemsHeight = Math.max(this.itemsHeight, item.y + item.height);
        // console.log(this.itemsHeight);
    }

    private downHandler(e) {
        if (!this._enabled) return;
        // console.log('scroll down');
        this._isDown = true;
        this.touchDownY = e.data.getLocalPosition(this, e.data.global).y;
        this.touchDownContainerY = this.itemsContainer.y;
    }

    private upHandler(e) {
        if (!this._enabled) return;
        // console.log('scroll up');
        this._isDown = false;
    }

    // private buttonClickedHandler(e) {
    //     if (!this._enabled) return;
    //     console.log('scroll down');
    //     this._isDown = false;
    // }
}
