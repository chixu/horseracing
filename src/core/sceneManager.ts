// import * as xml from "./util/xml";
// import * as director from "./director";
// import { isString } from "./core/lang";
import { Scene } from "./scene";

export class SceneManager {
    //   overlayContainer: PIXI.Container;
    sceneContainer: PIXI.Container;
    current: Scene;
    private scenes: Scene[];
    //   private scenesRegistry: { [id: string]: Element };

    constructor() {
        // this.overlayContainer = new PIXI.Container();
        this.sceneContainer = new PIXI.Container();
        // this.scenesRegistry = {};
        this.scenes = [];
    }

    // push(scene: Scene, hide: boolean = true, args?: any) {
    //     if (this.current) {
    //         //   this.current.blur();
    //         this.current.visible = !hide;
    //     }
    //     this.add(scene, args);
    // }

    // pop() {
    //     if (this.current) {
    //         this.current.exit();
    //         this.sceneContainer.removeChild(this.current);
    //         this.scenes.pop();
    //     }
    //     if (this.scenes.length > 0) {
    //         let scene = this.scenes[this.scenes.length - 1];
    //         scene.visible = true;
    //         scene.enter();
    //         this.current = scene;
    //     }
    // }

    replace(scene: Scene, args?: any) {
        if (this.current) {
            this.current.exit();
            this.sceneContainer.removeChild(this.current);
            this.scenes.splice(this.scenes.indexOf(this.current), 1);
        }
        this.add(scene, args);
    }

    //   resolve(scene: String | Scene): Scene {
    //     if (typeof scene === "string") {
    //       let sceneName = scene as string;
    //       let layout = this.scenesRegistry[sceneName];
    //       let s = director.injector.get(`scene:${sceneName}`, layout);
    //       if (!s) {
    //         s = new Scene(layout);
    //       }
    //       return s;
    //     } else {
    //       return scene as Scene;
    //     }
    //   }

    //   addOverlay(overlay: PIXI.DisplayObject) {
    //     this.overlayContainer.addChild(overlay);
    //   }

    //   removeOverlay(overlay: PIXI.DisplayObject) {
    //     this.overlayContainer.removeChild(overlay);
    //   }

    //   get current() {
    //     return this._current;
    //   }

    private add(scene: Scene, args?: any) {
        this.scenes.push(scene);
        this.sceneContainer.addChild(scene);
        this.current = scene;
        this.current.enter(args);
    }
}
