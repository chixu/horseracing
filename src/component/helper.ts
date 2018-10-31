import * as graphic from "../utils/graphic";
import * as director from "../core/director";


export class Helper extends PIXI.Container {
    // container;

    constructor(x, y, width, height, alpha = 0.6) {
        super();
        let screenW = director.config.width;
        let screenH = director.config.height;
        let r1 = graphic.rectangle(screenW, y);
        let r2 = graphic.rectangle(screenW, screenH - height - y);
        r2.y = height + y;
        let r3 = graphic.rectangle(x, height);
        r3.y = y;
        let r4 = graphic.rectangle(screenW - x - width, height);
        r4.position.set(x + width, y);
        r1.alpha = r2.alpha = r3.alpha = r4.alpha = alpha;
        r1.interactive = r2.interactive = r3.interactive = r4.interactive = true;
        this.addChild(r1, r2, r3, r4);
    }

}
