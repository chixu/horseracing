import * as graphic from "../utils/graphic";
import * as director from "./director";

export class Scene extends PIXI.Container {
    // container;
    maskPanel: PIXI.Graphics;
    constructor() {
        super();
    }

    enter(args?) {
        
    }

    exit() {

    }

    addMask(color = 0) {
        if (this.maskPanel == undefined)
            this.maskPanel = graphic.rectangle(director.config.width, director.config.height, color);
        this.maskPanel.interactive = true;
        this.addChild(this.maskPanel);
    }

    removeMask() {
        if (this.maskPanel)
            this.removeChild(this.maskPanel);
    }

}
