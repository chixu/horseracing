import { Resource } from "./resource";

export type MovieClipResourceOptions = {
    size: [number, number],
    frame: number,
    width: number
}

export class MovieClipResource extends Resource {

    private frames: PIXI.Texture[];

    constructor(public id: string,
        public src: string,
        public options: MovieClipResourceOptions) {
        super(id, src);
    };

    textures(): PIXI.Texture[] {
        if (!this.frames) {
            this.frames = [];
            if (this.data) {
                for (let i = 0; i < this.options.frame; i++) {
                    let rect;
                    // if the frame is 24 width is 6 => the sprite sheet is 6x4
                    // if the width is not specified => the sprite sheet is 24x1
                    if (this.options.width > 0)
                        rect = new PIXI.Rectangle(i % this.options.width * this.options.size[0], Math.floor(i / this.options.width) * this.options.size[1], this.options.size[0], this.options.size[1]);
                    else
                        rect = new PIXI.Rectangle(i * this.options.size[0], 0, this.options.size[0], this.options.size[1]);
                    this.frames.push(new PIXI.Texture(this.data.texture, rect));
                }
            }
        }
        return this.frames;
    }
}
