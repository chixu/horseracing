export class Slide extends PIXI.Container {
    currFrameName: string;
    frames: { [key: string]: PIXI.DisplayObject } = {};

    goto(frameName: string) {
        this.removeChildren();
        let frame = this.frames[frameName];
        frame.visible = true;
        this.currFrameName = frameName;
        this.addChild(frame);
    }

    add(frameName: string, frame: PIXI.DisplayObject) {
        this.frames[frameName] = frame;
        if (!this.currFrameName)
            this.goto(frameName);
    }

    get current(): PIXI.DisplayObject {
        return this.frames[this.currFrameName];
    }
}
