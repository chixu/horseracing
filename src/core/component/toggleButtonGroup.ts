import { ToggleButton } from "./toggleButton";

export type ToggleButtonGroupOption = {
    gap?: number,
    buttons: ToggleButton[],
    values: string[],
    defaultIndex?: number
}

export class ToggleButtonGroup extends PIXI.Container {
    buttons: ToggleButton[] = [];
    options: ToggleButtonGroupOption;
    selectedIndex: number;
    selectHandler;

    constructor(opt: ToggleButtonGroupOption) {
        super();
        this.options = opt;
        if (opt.buttons.length == 0) return;
        opt.gap = opt.gap || 0;
        let numButtons = opt.buttons.length;
        let buttonWidth = opt.buttons[0].width;
        let fullWidth = numButtons * (buttonWidth + opt.gap) - opt.gap;
        for (let i = 0; i < numButtons; i++) {
            let b = opt.buttons[i];
            b.x = i * (buttonWidth + opt.gap) + (buttonWidth - fullWidth) / 2;
            b['index'] = i;
            b['value'] = opt.values[i];
            b.clickHandler = () => {
                let idx = b['index']
                if (this.selectedIndex != idx) {
                    this.selectedIndex = idx;
                    this.select(idx);
                    if (this.selectHandler)
                        this.selectHandler(idx);
                }
            }
            this.buttons.push(b);
            this.addChild(b);
        }
        if (opt.defaultIndex == undefined) opt.defaultIndex = 0;
        this.select(opt.defaultIndex);
    }

    select(idx) {
        this.selectedIndex = idx;
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].selected = i == idx;
        }
    }

    get selectedText() {
        return this.buttons[this.selectedIndex]['value'];
    }
}
