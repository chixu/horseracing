import * as director from "../director";
// import { Orientation } from "../core/types";
// import { Register } from "../core/registry";
import { Service } from "./serviceManager";
// import { OrientationService } from "./orientationService";

export const EVENT_RESIZE = "events:resize";

// @Register({ tag: "layoutService", category: "service" })
export class LayoutService extends Service {

    //   private orientationService: OrientationService;
    private prevOrientation = 0;
    resizeChecker: number;
    windowHeight: number;
    windowWidth: number;

    configure(options) { }

    startup() {
        this.resizeChecker = setInterval(() => this.checkResize(), 30);
        this.checkResize();
    }

    checkResize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        if (this.windowHeight !== h || this.windowWidth !== w) {
            this.windowHeight = h;
            this.windowWidth = w;
            this.layout();
            //   director.eventBus.emit(EVENT_RESIZE);
        }
    }

    shutdown() {
        // window.onresize = undefined;
        clearInterval(this.resizeChecker);
    }

    // private orientationChangedHandler() {
    //   console.log("orientationChangedHandler");
    //   if (this.orientationService.mode === "both") {
    //     director.sceneManager.current.applyLayout(orientation === Orientation.PORTRAIT ? "portrait" : "landscape");
    //   }
    //   this.layout();
    // }

    private layout() {
        let config = director.config;
        let orignalWidth = config.width;
        let orignalHeight = config.height;
        let rotation = 0;
        // let orientation = this.orientationService.getOrientation();
        // if (this.orientationService.mode === "both" && orientation === Orientation.PORTRAIT) {
        //   //rotation = Math.PI / 2;
        //   orignalWidth = options.height;
        //   orignalHeight = options.width;
        // } else if (director.device.mobile &&
        //   ((this.orientationService.mode === "portrait" && orientation === Orientation.LANDSCAPE) ||
        //     (this.orientationService.mode === "landscape" && orientation === Orientation.PORTRAIT)
        //   )) {
        //   rotation = Math.PI / 2;
        //   orignalWidth = options.height;
        //   orignalHeight = options.width;
        // }

        let ratio = Math.min(window.innerWidth / orignalWidth, window.innerHeight / orignalHeight);
        let width = Math.ceil(orignalWidth * ratio);
        let height = Math.ceil(orignalHeight * ratio);

        director.stage.scale.set(ratio);
        // director.stage.rotation = rotation;
        // if (this.orientationService.mode === "both") {
        //   director.stage.position.set(0, 0);
        //   director.stage.pivot.set(0, 0);
        // } else {

        // }
        director.stage.position.set(width / 2, height / 2);
        director.renderer.resize(width, height);

        let canvas = config.canvas;
        canvas.style.marginLeft = ((window.innerWidth - width) / 2) + "px";
        canvas.style.marginTop = ((window.innerHeight - height) / 2) + "px";

        console.log(window.innerWidth, window.innerHeight, ratio, canvas.style.marginLeft, canvas.style.marginTop);
        // if (this.prevOrientation != orientation && this.orientationService.mode === "both" && director.sceneManager.current)
        //   director.sceneManager.current.onOrientationChange(orientation);
        // this.prevOrientation = orientation;
        this.scrollTop();
    }

    private scrollTop() {
        let device = director.device;
        if (device.mobile) {
            if (device.android && !device.chrome) {
                window.scrollTo(0, 1);
            } else {
                window.scrollTo(0, 0);
            }
        }
    }
}
