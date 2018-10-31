export function rectangle(w, h, color = 0) {
    let rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.drawRect(0, 0, w, h);
    return rect;
}

export function circle(radius: number, color: number = 0x0) {
    let g = new PIXI.Graphics();
    g.beginFill(color);
    g.drawCircle(0, 0, radius);
    g.endFill();
    return g;
}

export function rectBorder(w, h, color = 0, line = 1) {
    let rect = new PIXI.Graphics();
    rect.lineStyle(line, color);
    rect.moveTo(0, 0);
    rect.lineTo(w, 0);
    rect.lineTo(w, h);
    rect.lineTo(0, h);
    rect.lineTo(0, 0);
    return rect;
}

export function arrow(x, y, length, direction = 0, lineWidth = 3, color = 0xffffff) {
    let a = new PIXI.Graphics();
    a.lineStyle(lineWidth, color);
    a.moveTo(0, 0);
    a.lineTo(0, -length);
    a.lineTo(-10, -length + 20);
    a.moveTo(0, -length);
    a.lineTo(10, -length + 20);
    a.position.set(x, y);
    a.rotation = direction;
    return a;
}