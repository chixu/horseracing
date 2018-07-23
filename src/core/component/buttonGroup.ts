import { Label } from "./label";
import { RectButton } from "./rectButton";
import * as graphic from "../../utils/graphic"

export type ButtonGroupOption = {
    activateColor?: number,
    buttonWidth: number,
    buttonHeight: number,
    textHeight?: number,
    gap?: number,
    texts: string[],
    numButtons?: number,
    defaultIndex?: number
}

export class ButtonGroup extends PIXI.Container {
    buttons: RectButton[] = [];
    options: ButtonGroupOption;
    selectedIndex: number;
    selectHandler;

    constructor(opt: ButtonGroupOption) {
        super();
        this.options = opt;
        opt.gap = opt.gap || 0;
        opt.numButtons = opt.numButtons || opt.texts.length;
        opt.activateColor = opt.activateColor || 0xff0000;
        opt.defaultIndex = opt.defaultIndex || 0;
        let width = opt.numButtons * (opt.buttonWidth + opt.gap) - opt.gap;
        for (let i = 0; i < opt.numButtons; i++) {
            let b = new RectButton(opt.buttonWidth, opt.buttonHeight);
            b.text = opt.texts[i];
            b.x = i * (opt.buttonWidth + opt.gap) + (opt.buttonWidth - width) / 2;
            b['index'] = i;
            b.renderBorder(0x333333);
            b.clickHandler = () => {
                if (this.selectedIndex != b['index']) {
                    this.selectedIndex = b['index'];
                    this.unselectAll();
                    b.render(opt.activateColor);
                    b.label.text.tint = 0xffffff;
                    if (this.selectHandler)
                        this.selectHandler(b['index']);
                }
            }
            this.buttons.push(b);
            this.addChild(b);
        }
        this.select(opt.defaultIndex);
    }

    unselectAll() {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].render(0xffffff);
            this.buttons[i].label.text.tint = 0x333333;
        }
    }

    select(idx) {
        this.buttons[idx].clickHandler();
    }

    get selectedText() {
        return this.buttons[this.selectedIndex].text;
    }
}
