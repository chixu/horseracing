import { Scene } from "./core/scene";
import * as director from "./core/director";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/rectButton";
import { SinglePlayerScene } from "./singlePlayerScene";
import { MultiPlayerScene } from "./multiPlayerScene";
import { MatchListScene } from "./matchListScene";
import { RecordScene } from "./recordScene";

export class SelectionScene extends Scene {
    lastButtonY = 170;
    buttonGap = 130;

    constructor() {
        super();
        this.sceneName = "初始界面";
        let l = new Label("多空赛马", { fontSize: 50 });
        this.addChild(l);
        l.position.set(director.config.width / 2, 150);

        this.addButton("单人游戏", ()=>{
            director.sceneManager.replace(new SinglePlayerScene());
        });
        this.addButton("多空大赛", ()=>{
            director.sceneManager.replace(new MatchListScene());
        });
        this.addButton("多人游戏", ()=>{
            director.socket.init().then(() =>
                director.sceneManager.replace(new MultiPlayerScene())
            );
        });
        if (!director.user.isLogin) {
            this.addButton("登 录", ()=>{
                director.user.showLogin(()=>director.sceneManager.replace(new SelectionScene()));
            });
        } else {
            this.addButton("英雄榜", ()=>{
                director.sceneManager.push(new RecordScene());
            });
        }
    }

    addButton(txt, callback){
        let b = new RectButton(220, 65, 0xff0000);
        b.text = txt;
        b.clickHandler = callback;
        this.addChild(b);
        this.lastButtonY += this.buttonGap
        b.position.set(director.config.width / 2, this.lastButtonY);
    }
}
