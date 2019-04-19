
import { Label } from "./core/component/label";
// import { RectButton } from "./core/component/rectButton";
// import { ButtonGroup } from "./core/component/buttonGroup";
import { Scene } from "./core/scene";
import * as director from "./core/director";
import * as display from "./utils/display";
import * as graphic from "./utils/graphic";
import { ToggleButton } from "./core/component/toggleButton";
import { ToggleButtonGroup } from "./core/component/toggleButtonGroup";

export class RecordScene extends Scene {
    recordContainer: PIXI.Container;
    trackButtons: ToggleButtonGroup;

    constructor() {
        super();
        display.addBg(this);
        display.addTitle(this, '排行榜');
        this.sceneName = "龙虎榜";
        // let l = new Label("排行榜", { fontSize: 50 });
        // this.addChild(l);
        // l.position.set(director.config.width / 2, 100);

        let b2 = display.exitButton();
        b2.clickHandler = () => {
            director.sceneManager.pop();
        }
        b2.y = 750;
        this.addChild(b2);

        this.recordContainer = new PIXI.Container();
        this.addChild(this.recordContainer);

        let btnG = this.createToggleButtonGroup();
        btnG.position.set(director.config.width / 2, 710);
        btnG.selectHandler = (idx) => {
            // console.log(idx, 'selected');
            this.getRankings(idx + 1);
        }
        this.addChild(btnG);
        this.trackButtons = btnG;
        this.getRankings(1);
    }

    getRankings(level) {
        director.request.get('get_score', { level: level }).then(res => {
            if (res.err) {
                console.log(res.err);
            } else
                this.renderRankings(res.data);
        });
    }

    renderRankings(data) {
        // console.log(data);
        this.recordContainer.removeChildren();
        if (data.length == 0) {
            let l = new Label("还没有排名,快去挑战吧", { fontSize: 30 });
            l.position.set(director.config.width / 2, 360);
            this.recordContainer.addChild(l);
        } else {
            let h1 = new Label("排名", { fontSize: 22 });
            let h2 = new Label("玩家", { fontSize: 22 });
            let h3 = new Label("收益", { fontSize: 22 });
            let headY = 225;
            h1.position.set(140, headY);
            h2.position.set(300, headY);
            h3.position.set(460, headY);
            this.recordContainer.addChild(h1);
            this.recordContainer.addChild(h2);
            this.recordContainer.addChild(h3);
            let line = graphic.line(400, 0, 0xffffff, 2);
            line.position.set((director.config.width - line.width) / 2, headY + 25);
            this.recordContainer.addChild(line);
            let i = 0;
            for (let k in data) {
                let top = 50;
                let gap = 42;
                let fontsize = 20;
                let d = data[k];
                let l1 = new Label((i + 1).toString(), { fontSize: fontsize });
                let l2 = new Label(d.user, { fontSize: fontsize });
                let l3 = new Label((parseFloat(d.value)).toFixed(2) + "%", { fontSize: fontsize });
                l1.position.set(h1.x, h1.y + i * gap + top);
                l2.position.set(h2.x, h2.y + i * gap + top);
                l3.position.set(h3.x, h3.y + i * gap + top);
                this.recordContainer.addChild(l1);
                this.recordContainer.addChild(l2);
                this.recordContainer.addChild(l3);
                i++;
            }
        }
    }

    createToggleButton(text: string) {
        let b = new ToggleButton();
        b.top = new Label(text, { fontSize: 22 });
        let up = graphic.rectangle(30, 40, 0xff0000);
        up.position.set(-up.width / 2, -10);
        up.alpha = 0;
        b.up = up;
        let down = graphic.rectangle(22, 3, 0xffffff);
        down.position.set(-down.width / 2, 17);
        b.down = down;
        return b;
    }

    createToggleButtonGroup() {
        let values = ["1", "2", "3", "4", "5", "6"];
        let buttons = [];
        for (let k in values) {
            buttons.push(this.createToggleButton(values[k]));
        }
        return new ToggleButtonGroup({
            buttons: buttons,
            values: values,
            gap: 25
        })
    }
}