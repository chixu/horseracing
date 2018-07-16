// import { Type, isArray, Map, isBlank, isPresent } from "./core/lang";
// import { Orientation } from "./core/types";
// import * as xml from "../utils/xml";
// import { AppContext } from "./core/appContext";
import { Device } from "./device";
// import { Injector } from "./core/injector";
// import { SingleEventEmitter } from "./core/singleEventEmitter";
// import { InputManager } from "./core/inputManager";
import { ResourceManager } from "./resourceManager";
import { Resource } from "./resource";
import { SpriteSheetResource } from "./spriteSheetResource";
import { Candle } from "../component/candle";
// import { Scene } from "./scene";
import { SceneManager } from "./sceneManager";
import { User } from "../user";
import { SelectionScene } from "../selectionScene";
import { ServiceManager } from "./service/serviceManager";
import { LayoutService } from "./service/layoutService";
// import { Animatable } from "./animation/animatable";
// import { Juggler } from "./animation/juggler";
// import { DeviceService } from "./services/deviceService";
// import { Text } from "./i18n/text";
// import { tracker } from "./tracking/tracker";
// import * as slotApp from "./slotMachine/slotApp";

// export const injector: Injector = new Injector();
export const sceneManager: SceneManager = new SceneManager();
export const resourceManager: ResourceManager = new ResourceManager();
export const serviceManager: ServiceManager = new ServiceManager();
// export const eventBus: SingleEventEmitter = new SingleEventEmitter();
// export const inputManager: SingleEventEmitter = new SingleEventEmitter();
// export const juggler: Juggler = new Juggler();
// export let elapsedMS: number = 0;
// export const text: Text = new Text();
export let user: User = new User();
export const device: Device = new Device();
export let config;
export let renderer: PIXI.SystemRenderer;
export let stage: PIXI.Container;
export let app;
let rect;
// export let appContext: AppContext;
// export let launchTime: number;
// export let config: any;

export type Options = {
    canvas: HTMLCanvasElement,
    width?: number,
    height?: number,
    backgroundColor?: number,
    resolution?: number
}

function createRenderer(options: Options) {
    //PIXI.SCALE_MODES = PIXI.SCALE_MODES.LINEAR;
    let opt = {
        view: options.canvas,
        backgroundColor: options.backgroundColor,
        autoResize: true,
        antialias: true,
        resolution: options.resolution,
    };
    let renderer = PIXI.autoDetectRenderer(options.width, options.height, opt);
    //.appendChild(renderer.view);

    return renderer;
}

// export function initialize(slotapp) {
//   //device.initialize();
//   config = slotapp;
//   device.platform = slotapp.config.name;
//   launchTime = slotapp.launchTime;
//   tracker.initialize();
//   appContext = injector.get("context");
//   return appContext.initialize();
// }

export function run() {
    config = {};
    //   appContext.ID = xml.id(app);
    //   let enterScene = xml.str(app, "enter");
    config.canvas = document.getElementById("stage");
    config.width = 600;//xml.num(app, "width", 800);
    config.height = 900;//xml.num(app, "height", 600);
    config.resolution = 2;//xml.num(app, "resolution", 1);
    config.backgroundColor = 0x0;//xml.num(app, "backgroundColor", 0x0);
    renderer = createRenderer(config);

    //   for (let i = 0; i < app.attributes.length; i++) {
    //     let propName = app.attributes[i].name;
    //     if (appContext[propName] === undefined)
    //       appContext[propName] = app.attributes[i].value;
    //   }
    //   appContext.getHudLanguage();
    //   appContext.printEngineVersion();
    //   config.opid = (appContext['OPERATOR'] || '').toUpperCase();
    //   config.gameid = appContext.ID;
    //   hacky();
    stage = new PIXI.Container();
    stage.name = "global";
    // let c = new Candle();
    // c.x = 400;
    // c.y = 100;
    // stage.addChild(c);
    stage.addChild(sceneManager.sceneContainer);
    //   stage.addChild(sceneManager.overlayContainer);
    stage.pivot.set(config.width / 2, config.height / 2);


    resourceManager.add(new Resource('star', './images/star.png'));
    resourceManager.add(new Resource('lock', './images/lock.png'));
    resourceManager.add(new SpriteSheetResource('rider', './images/hr.png', {
        size: [64, 69],
        width: 4,
        frame: 16
    }));
    resourceManager.add(new SpriteSheetResource('horse', './images/h1.png', {
        size: [64, 57],
        width: 8,
        frame: 64
    }));
    resourceManager.load();
    resourceManager.on("complete", () => {
        // console.log('loaded');
        // let texture = resourceManager.texture('cat');
        // let image = new PIXI.Sprite(texture);
        // stage.addChild(image);
        sceneManager.replace(new SelectionScene());
    });

    // configure scenes
    //   xml.forEachElement(app.querySelector("scenes"), (curr, i) => {
    //     sceneManager.register(curr);
    //   });
    // configure services
    //   xml.forEachElement(app.querySelector("services"), (opt, i) => {
    //     let service = services.get<Service>(opt.nodeName);
    //     if (!service) console.log("service " + opt.nodeName + " not found");
    //     service.configure(opt);
    //   });
    // start all services
    serviceManager.register('layout', new LayoutService());
    serviceManager.startup();
    // enter first scene
    //   sceneManager.replace(enterScene);
    PIXI.ticker.shared.add(update);

    //   let trackFPS = () => tracker.metric({ name: 'FPS', value: Math.round(PIXI.ticker.shared.FPS) });
    //   trackFPS();
    //   setInterval(trackFPS, 300000)
}

function update(elapsedFrames: number) {
    //   elapsedMS = PIXI.ticker.shared.elapsedMS;
    //   juggler.advanceTime(elapsedFrames);
    renderer.render(stage);
}

// https://github.com/pixijs/pixi.js/issues/2369
// function hacky() {
//   let badAndroidDevice = navigator.userAgent.indexOf("Android") > -1 && !(navigator.userAgent.indexOf("Chrome") > -1);
//   if (badAndroidDevice) {
//     let interactionManager = (renderer as any).plugins.interaction;
//     window.document.removeEventListener('mousemove', interactionManager.onMouseMove, true);
//     interactionManager.interactionDOMElement.removeEventListener('mousedown', interactionManager.onMouseDown, true);
//     interactionManager.interactionDOMElement.removeEventListener('mouseout', interactionManager.onMouseOut, true);
//   }
// }