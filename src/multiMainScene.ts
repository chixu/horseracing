import { Scene } from "./core/scene";
import { Candle } from "./component/candle";
import * as director from "./core/director";
import { Command } from "./core/socket";
import { CandleTrack } from "./component/candleTrack";
import { Axis } from "./component/axis";
import { LocalDataAdapter } from "./component/dataAdapter";
import { Label } from "./core/component/label";
import { RectButton } from "./core/component/RectButton";
import * as http from "./utils/http";
import * as date from "./utils/date";
import * as graphic from "./utils/graphic";
import { SelectionScene } from "./selectionScene";
import { MainScene, GameMode } from "./mainScene";
import * as math from "./utils/math";
import * as array from "./utils/array";
import { MultiPlayerScene } from "./multiPlayerScene";
// import $ from "jquery";

export class MultiMainScene extends MainScene {
    playersData: any;
    owner: boolean;
    replay;
    replay2;
    isReady;
    countDownNumber;
    countDownLabel: Label;
    startButton;

    constructor(data) {
        let d = director.socket.prevData
        data.mode = GameMode.Multi;
        super(data);
        this.playersData = d.u;
        this.owner = d.o == 1;
        this.isReady = false;
        this.countDownNumber = 3;
        let startButton = new RectButton(200, 60, 0x00ff00);
        startButton.text = "准备开始";
        startButton.position.set(director.config.width / 2, 430);
        startButton.clickHandler = () => {
            startButton.text = "等待其他玩家";
            director.socket.send(Command.gameReady);
        };
        this.addChild(startButton);
        this.startButton = startButton;

        let label = new Label('', { fontSize: 50 });
        label.x = startButton.x;
        label.y = startButton.y;
        this.addChild(label);
        label.visible = false;
        this.countDownLabel = label;

        for (let i = 1; i < this.tracks.length; i++) {
            this.tracks[i].enabled = false;
        }
        // this.updateCountDown();
    }

    updateCountDown() {
        this.countDownLabel.value = "游戏在" + this.countDownNumber + "秒后开始";
    }

    countDown() {
        this.countDownLabel.visible = true;
        this.startButton.visible = false;
        this.updateCountDown();
        setInterval(() => {
            this.countDownNumber--;
            if (this.countDownNumber == 0 && this.isReady) {
                this.countDownLabel.visible = false;
                for (let i = 1; i < this.tracks.length; i++) {
                    this.tracks[i].enabled = true;
                }
                this.setRoundTimeout();
            } else {
                this.updateCountDown();
            }
        }, 1000);
    }

    getData() {
        let dataAdapter = new LocalDataAdapter(this);
        let prevData = director.socket.prevData;
        return dataAdapter.getData(prevData.id, prevData.i).then(datas => {
            console.log(datas);
            this.tracks[0].setDatas();
            let i = 0;
            for (let k in datas) {
                i++
                this.tracks[i].setDatas(datas[k], k);
            }
            this.dataReceived();
        });
    }

    enter(args?) {
        director.socket.on(Command.gameReady, (data) => {
            this.isReady = true;
            this.countDown();
        });
        director.socket.on(Command.gameOver, (data) => {
            this.gameOver(data);
        });
        director.socket.on(Command.restartGame, (data) => {
            director.sceneManager.replace(new MultiMainScene(data));
        });
        director.socket.on(Command.nextRound, (data) => {
            this.playersData = data;
            this.next();
        });
        director.socket.on(Command.leaveGame, (data) => {
            this.winPanel.removeChild(this.replay2);
            this.winPanel.removeChild(this.replay);
        });
    }

    setRoundTimeout() {
        setTimeout(() => {
            director.socket.send(Command.nextRound, { r: this.round, s: math.toFixedNumber(this.profit, 2) });
        }, this.options.t * 1000);
    }

    // gameStart() {
    //     this.next();
    //     this.setRoundTimeout();
    // }

    next() {
        this.round++;
        this.enabled = true;
        if (this.isReady)
            this.setRoundTimeout();
        this.renderNext();
    }

    renderPlayers() {
        this.axis.renderPlayers(this.playersData);
        this.sideAxis.renderPlayers(this.playersData);
    }

    renderGameOverUi() {
        if (this.winPanel == undefined) {
            this.winPanel = new PIXI.Container;
        }
        this.addChild(this.winPanel);
        this.winPanel.removeChildren();
        let rect = graphic.rectangle(director.config.width, director.config.height);
        this.winPanel.addChild(rect);
        rect.interactive = true;
        rect.alpha = 0.7;

        if (this.owner) {
            let replay = new RectButton(180, 60, 0x00ff00);
            replay.text = "重玩";
            replay.position.set(director.config.width / 2, 670);
            replay.clickHandler = () => {
                director.socket.send(Command.restartGame, 1);
            }
            this.winPanel.addChild(replay);
            let replay2 = new RectButton(180, 60, 0x00ff00);
            replay2.text = "换股";
            replay2.position.set(director.config.width / 2, 760);
            replay2.clickHandler = () => {
                director.socket.send(Command.restartGame, 0);
            }
            this.winPanel.addChild(replay2);
            this.replay = replay;
            this.replay2 = replay2;
        }
        let exit = new RectButton(180, 60, 0xff0000);
        exit.text = "退出";
        exit.clickHandler = () => {
            director.socket.send(Command.leaveGame);
            director.sceneManager.replace(new SelectionScene());
        }
        exit.position.set(director.config.width / 2, 850);
        this.winPanel.addChild(exit);

        let l1 = new Label("恭喜你", { fontSize: 50 });
        this.winPanel.addChild(l1);
        l1.position.set(director.config.width / 2, 50);
    }

    gameOver(data?) {
        this.renderGameOverUi();
        console.log('multi');
        let rank = '';
        let playerRank;
        let allPlayers = [];
        for (let i = 1; i < this.tracks.length; i++) {
            let t: CandleTrack = this.tracks[i];
            let name = t.stockName;
            let d = '(' + date.dateToYYmmdd(t.startDate) + '-' + date.dateToYYmmdd(t.endDate) + ')';
            // rank += (i + 1) + '. ' + name + d + '  ' + t.profit.toFixed(2) + '%\n';
            console.log(name + d, t.profit);
            allPlayers.push({ name: name + d, profit: t.profit });
        }
        console.log(allPlayers);
        allPlayers.push({ name: '你', profit: this.profit });
        let otherPlayers = data;
        for (let i = 0; i < otherPlayers.length; i++) {
            console.log(otherPlayers[i].n, otherPlayers[i].s);
            allPlayers.push({ name: otherPlayers[i].n, profit: otherPlayers[i].s });
        }
        let sortedTracks = array.sortDesc(allPlayers, 'profit');

        for (let i = 0; i < sortedTracks.length; i++) {

            let d = sortedTracks[i];
            if (d.name == '你')
                playerRank = i + 1;
            rank += (i + 1) + '. ' + d.name + '  ' + d.profit.toFixed(2) + '%\n';
        }
        console.log(rank);
        let l3 = new Label(rank, { fontSize: 30 });
        this.winPanel.addChild(l3);
        l3.position.set(director.config.width / 2, 410);

        let l2 = new Label(`您最后的收益率为${this.profit.toFixed(2)}%\n排名第${playerRank}`, { fontSize: 40 });
        this.winPanel.addChild(l2);
        l2.position.set(director.config.width / 2, 170);
    }

    exit() {
        // director.socket.off(Command.gameInfo);
        director.socket.off(Command.gameOver);
        director.socket.off(Command.nextRound);
        director.socket.off(Command.restartGame);
        director.socket.off(Command.leaveGame);
    }
}
