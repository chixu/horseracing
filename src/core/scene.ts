import * as graphic from "../utils/graphic";
import * as director from "./director";

export class Scene extends PIXI.Container {
    // container;
    sceneName: string;
    maskPanel: PIXI.Graphics;
    private startViewTime: number;
    constructor() {
        super();
    }

    enter(args?) {
        director.tracker.event({
            cat: 'scene',
            action: 'enter',
            label: this.sceneName,
            name: 'Scene Enter',
            properties: {
                'Name': this.sceneName
            }
        });
        this.startViewTime = (new Date()).getTime();
    }

    exit() {
        let stayTime = (new Date()).getTime() - this.startViewTime;
        director.tracker.event({
            cat: 'scene',
            action: 'exit',
            label: this.sceneName,
            value: stayTime,
            name: 'Scene Exit',
            properties: {
                'Name': this.sceneName
            },
            measurements: {
                'Time': stayTime
            }
        });
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
