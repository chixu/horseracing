import { ImageButton } from '../core/component/imageButton';
import { Label } from "../core/component/label";
import * as director from '../core/director';
import * as graphic from '../utils/graphic';

export function normalButton(label: string) {
    let b = new ImageButton({
        src: 'btn_bg.png',
        text: label,
        textHeight: 30,
        textX: 160,
        textY: 63,
    });
    b.x = 137;
    return b;
}

export function exitButton() {
    let b = normalButton('退出');
    b.y = 730
    return b;
}

export function addBg(scene) {
    let bg = director.resourceManager.createImage('bg.png');
    scene.addChild(bg);
    return bg;
}

export function addTitle(scene, title: string = '') {
    let l = director.resourceManager.createImage('title.png');
    centerPivot(l);
    l.position.set(director.config.width / 2, 120);
    if (title) {
        let txt = new Label(title, { fontSize: 28 });
        txt.position.set(l.width / 2, 70);
        l.addChild(txt);
    }
    scene.addChild(l);
    return l;
}

export function centerPivot(obj: PIXI.Sprite) {
    obj.pivot.set(obj.width / 2, obj.height / 2);
}


export function addMsgboxBg(title) {
    let panel = new PIXI.Container();
    let bg = graphic.rectangle(director.config.width, director.config.height, 0);
    bg.alpha = 0.7;
    bg.interactive = true;
    panel.addChild(bg);
    let t = director.resourceManager.createImage('msgbox_title.png');
    let box = director.resourceManager.createImage('msgbox.png');
    centerPivot(t);
    centerPivot(box);
    t.position.set(director.config.width / 2, 95);
    box.scale.set(1.1, 1.3);
    box.position.set(director.config.width / 2, 480);
    panel.addChild(box);
    if (title) {
        let txt = new Label(title, { fontSize: 28 });
        txt.position.set(director.config.width / 2, t.y - 2);
        panel.addChild(t);
        panel.addChild(txt);
    }
    return panel;
}

export function addMsgbox(opts) {
    let _title = opts.title;;
    // let _maintxt = opts.maintxt;
    let panel = addMsgboxBg(_title);
    let _l1 = opts.l1 || '';
    let _l2 = opts.l2 || '';
    let _l3 = opts.l3 || '';
    
    let l1 = new Label(_l1, { fontSize: 30, fill: 0x7afff9 });
    l1.position.set(director.config.width / 2, 250);
    let l2 = new Label(_l2, { fontSize: 30, fill: 0x7afff9 });
    l2.position.set(director.config.width / 2, l1.y + 60);
    let l3 = new Label(_l3, { fontSize: 30, fill: 0x7afff9 });
    l3.position.set(director.config.width / 2, l2.y + 60);

    panel.addChild(l1);
    panel.addChild(l2);
    panel.addChild(l3);
    addButtonsToMsgbox(panel, opts);
    return panel;
}

export function congratsPanel(opts) {

    let _title = opts.title;
    let _l1 = opts.l1 || '';
    let _l2 = opts.l2 || '';
    let _l3 = opts.l3 || '';
    let _maintxt = opts.maintxt;
    let panel = addMsgboxBg(_title);
    // scene.addChild(panel);

    let l1 = new Label(_l1, { fontSize: 25, fill: 0x7afff9 });
    l1.position.set(director.config.width / 2, 190);
    let l2 = new Label(_l2, { fontSize: 25, fill: 0x7afff9 });
    l2.position.set(director.config.width / 2, l1.y + 40);

    let l3 = new Label(_l3, { fontSize: 18, fill: 0x7afff9 });
    l3.position.set(director.config.width / 2, l2.y + 50);
    let s1 = director.resourceManager.createImage('bar2.png');
    centerPivot(s1);
    s1.position.set(director.config.width / 2, l3.y + 40);

    let l_rank = new Label(_maintxt, { fontSize: 22, align: 'left', lineHeight: 30 });
    l_rank.position.set(director.config.width / 2 - 180, s1.y + 25);

    panel.addChild(l1);
    panel.addChild(l2);
    panel.addChild(l3);
    panel.addChild(s1);
    panel.addChild(l_rank);
    // panel.addChild(s2);
    addButtonsToMsgbox(panel, opts);
    return panel;

}

export function addButtonsToMsgbox(panel, opts) {
    let _btns = [];
    for (let i = 1; i < 5; i++) {
        if (opts['b' + i])
            _btns.push(opts['b' + i]);
    }
    let btns = [];
    for (let k in _btns) {
        let b = normalButton(_btns[k].label);
        b.clickHandler = _btns[k].handler;
        btns.push(b);
    }
    if (btns.length == 4)
        arrangeButtons(btns, 195, 755, -62, .65);
    else if (btns.length == 3)
        arrangeButtons(btns, 188, 740, -70, .7);
    else
        arrangeButtons(btns, 155, 720, -90, .9);
    for (let k in btns) {
        panel.addChild(btns[k]);
    }
}

export function arrangeButtons(btns, x, y, gap, scale?) {
    for (let i = 0; i < btns.length; i++) {
        let b = btns[i];
        if (scale)
            b.scale.set(scale, scale);
        b.position.set(x, y + i * gap);
    }
}