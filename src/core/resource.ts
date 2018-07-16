// import * as director from "../director";
// import { AppContext } from "../core/appContext";
// import * as xml from "../util/xml";

export class Resource {

  data;

  constructor(public id: string, public src: string, public global: boolean = true) { }

  addTo(loader: PIXI.loaders.Loader) {
    loader.add(this.id, this.src);
  }

  loaded(data: PIXI.loaders.Resource) {
    this.data = data;
  }

  destroy(destroyBase?: boolean) {
    if (this.data) {
      this.data.texture.destroy(destroyBase);
    }
  }

//   static create(def: Element): Resource {
//     return new Resource(xml.id(def), this.getVersionSrc(def), xml.bool(def, "global", true));
//   }
}
