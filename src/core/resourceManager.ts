import EventEmitter from "./eventEmitter";
import { Resource } from "./resource";
// import { SpritesheetResource } from "./spritesheetResource";
// import { TextResource } from "./textResource";
// import { AudioResource } from "./audioResource";

// function resolveImage(resources, params) {
//   return resources.texture(params[1]) || PIXI.Texture.EMPTY;
// }

// function resolveImages(resources, params) {
//   let textures = [];
//   params[1].split("|").forEach((name, i, arr) => {
//     textures.push(resources.texture(name) || PIXI.Texture.EMPTY);
//   });
//   return textures;
// }

// function resolveTextureAtlas(resources, params) {
//   let atlas = resources.atlas(params[1]);
//   if (!atlas) {
//     return [];
//   }
//   if (params.length === 2) {
//     // @atlas/{name}
//     let textures = [];
//     for (let key in atlas) {
//       textures.push(atlas[key]);
//     }
//     return textures;
//   } else {
//     // @atlas/{name}/{t1}|{t2}|{t3}
//     let extra = params[2];
//     let textures = [];
//     extra.split("|").forEach((name, i, arr) => {
//       textures.push(atlas[name]);
//     });
//     return textures.length === 1 ? textures[0] : textures;
//   }
// }

// function resolveSpriteSheet(resources, params): any {
//   let r = resources.resource(params[1]);
//   if (r instanceof SpritesheetResource) {
//     return r.textures();
//   }
//   return PIXI.Texture.EMPTY;
// }

// function resolveAudio(resources, params) {
//   let r = resources.resource(params[1]);
//   if (r instanceof AudioResource) {
//     return r.url;
//   }
//   return undefined;
// }

export class ResourceManager extends EventEmitter {
  private resources: { [id: string]: any };
  private spirtesheets: { [id: string]: any };

  constructor(public loader: PIXI.loaders.Loader = PIXI.loader) {
    super();
    this.loader.on('progress', (_, data: PIXI.loaders.Resource) => {
      console.log('pro', data)
      let d = this.resources[data.name];
      if (d) {
        if (d.type == 'image')
          d.data = data.texture;
        else if (d.type == 'json')
          d.data = data.data;
        else if (d.type == 'spritesheet'){
          for(let k in data.textures){
            this.spirtesheets[k] = data.textures[k];
          }
        }
      }
    });
    this.loader.on('complete', (_, resources) => {
      this.loader.reset();
      this.emit("complete");
    });
    this.resources = {};
    this.spirtesheets = {};
  }

  resource(name: string) {
    if(this.resources[name])
      return this.resources[name].data;
    if(this.spirtesheets[name])
      return this.spirtesheets[name];
  }

  createImage(name: string) {
    let texture = this.resource(name);
    console.log(texture);
    let image = new PIXI.Sprite(texture);
    return image;
  }

  texture(name: string): PIXI.Texture {
    let r = this.resource(name);
    if (r) {
      if (r.data.url.toLowerCase().indexOf("svg"))
        return PIXI.Texture.fromImage(r.data.url);
      else
        return r.data.texture;
    }
    return undefined;
  }

  // atlas(name: string): { [name: string]: PIXI.Texture } {
  atlas(name: string): PIXI.Texture[] {
    let r = this.resources[name];
    if (r) {
      // return (r.data as any).textures;
      return (r as any).textures();
    }
    return undefined;
  }

  frame(name: string): PIXI.Texture {
    return PIXI.utils.TextureCache[name];
  }

  // json(name: string) {
  //   let r = this.resources[name] as TextResource;
  //   if (r) {
  //     return r.json;
  //   }
  //   return undefined;
  // }

  // xml(name: string): Element {
  //   let r = this.resources[name] as TextResource;
  //   if (r) {
  //     return r.xml;
  //   }
  //   return undefined;
  // }

  // text(name: string): string {
  //   let r = this.resources[name] as TextResource;
  //   if (r) {
  //     return r.data;
  //   }
  //   return undefined;
  // }

  // audio(name: string): any {
  //   let r = this.resources[name] as AudioResource;
  //   if (r) {
  //     return r.url;
  //   }
  //   return undefined;
  // }

  // resolve(res: string) {
  //   let defaultValue = PIXI.Texture.EMPTY;
  //   if (!res || res.length === 0) {
  //     return defaultValue;
  //   }
  //   let params = res.split("/");
  //   switch (params[0]) {
  //     case "@img":
  //       return resolveImage(this, params);
  //     case "@audio":
  //       return resolveAudio(this, params);
  //     case "@images":
  //       return resolveImages(this, params);
  //     case "@atlas":
  //       return resolveTextureAtlas(this, params);
  //     case "@sheet":
  //       return resolveSpriteSheet(this, params);
  //     case "@text":
  //       return this.text(params[1]);
  //     case "@json":
  //       return this.json(params[1]);
  //     case "@xml":
  //       return this.xml(params[1]);
  //     case "@res":
  //       return this.resource(params[1]);
  //     default:
  //       return defaultValue;
  //   }
  // }
  addResource(id, src, type) {
    this.resources[id] = {
      id: id,
      src: src,
      type: type
    }
    console.log(this.resources);
  }

  add(resource: Resource) {
    resource.addTo(this.loader);
    this.resources[resource.id] = resource;
  }

  load() {
    for (let k in this.resources) {
      console.log(k, this.resources[k].src);
      this.loader.add(k, this.resources[k].src);
    }
    this.loader.load();
  }

  remove(id: string) {
    let res = this.resources[id];
    if (res) {
      res.destroy(true);
    }
  }

  clear(global: boolean = false) {
    let res: Resource[] = [];
    for (let id in this.resources) {
      let r = this.resources[id];
      if (global || !r.global) {
        r.destroy(true);
        res.push(r);
      }
    }
    res.forEach((r, i, arr) => {
      delete this.resources[r.id];
    });
    res = null;
  }

  get progress() {
    return this.loader.progress;
  }
}
