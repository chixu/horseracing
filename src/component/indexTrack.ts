import { MainScene } from "../mainScene";
import { CandleTrack } from "./candleTrack";

export class IndexTrack extends CandleTrack {

    constructor(mainScene: MainScene, index) {
        super(mainScene, index);
        // this.color = 0;
    }

    initUI(index){
        this.lineColor = 0xffffff;
    }

    renderCandle() {
    }
}