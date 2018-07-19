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
// import $ from "jquery";

export class MultiMainScene extends MainScene {
    playersData: any;

    constructor(num) {
        MainScene.gameMode = GameMode.Multi;
        super(num);
        this.playersData = director.socket.prevData.u;
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
        director.socket.on(Command.gameOver, (data) => {
            this.gameOver(data);
        });
        director.socket.on(Command.nextRound, (data) => {
            this.playersData = data;
            this.next();
        });
    }

    setRoundTimeout() {
        setTimeout(() => {
            director.socket.send(Command.nextRound, { r: this.round, s: math.toFixedNumber(this.profit, 2) });
        }, 3000);
    }

    // gameStart() {
    //     this.next();
    //     this.setRoundTimeout();
    // }

    next() {
        this.round++;
        this.enabled = true;
        this.setRoundTimeout();
        this.renderNext();
    }

    renderPlayers() {
        this.axis.renderPlayers(this.playersData);
        this.sideAxis.renderPlayers(this.playersData);
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
            if(d.name == '你')
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
    }
}
