export class Label extends PIXI.Container {
    // container;
    text: PIXI.Text;
    align: string;

    constructor(str = "", opt: any = {}) {
        super();
        let style: any = {
            fontFamily: opt.font || "Arial",
            fontSize: opt.fontSize || 30,
            fill: opt.fill || "white",
            // stroke: '#ff3300',
            // strokeThickness: 4,
            // dropShadow: true,
            // dropShadowColor: "#000000",
            // dropShadowBlur: 4,
            // dropShadowAngle: Math.PI / 6,
            // dropShadowDistance: 6,
        };
        this.text = new PIXI.Text(str, style);
        this.align = opt.align || 'center';
        this.addChild(this.text);
        this.update();
    }
    update() {
        if (this.align == 'center') {
            this.text.x = -this.text.width * 0.5;
            this.text.y = -this.text.height * 0.5;
        }
    }

    set value(txt: string) {
        this.text.text = txt;
        this.update();
    }

    get value(): string {
        return this.text.text;
    }
}
