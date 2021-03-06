import { MainScene, GameMode } from "../mainScene";
import * as math from "../utils/math";
import * as array from "../utils/array";
import * as http from "../utils/http";
import * as director from "../core/director";
import { CandleTrack } from "./candleTrack";
import { Request } from "../constant";

export class DataAdapter {
    // mainScene :MainScene;
    dataDates: number[];

    constructor(public mainScene: MainScene) {

    }

    getData() {

    }
}

export class ServerDataAdapter extends DataAdapter {

    getData() {
        let o = this.mainScene.options;
        if (this.mainScene.gameMode == GameMode.Helper) {
            // return director.request.get('helper_stock_data', {}, true);
            return director.request.get('./data/helper_stock_data.json', {}, true);
        } else if (this.mainScene.gameMode == GameMode.Match || this.mainScene.gameMode == GameMode.Multi) {
            return director.request.get(Request.gameStockInfo, {
                code: o.code + (this.mainScene.showIndex ? "_i000001" : ""),
                date: o.enddate,
                days: o.days
            }, true);
        } else {
            return director.request.post('get_stock', {
                count: this.mainScene.numTracks
            }).then(res => {
                if (res.err)
                    console.log(res.err);
                else
                    return director.request.get(Request.gameStockInfo, {
                        code: res.data.code + (this.mainScene.showIndex ? "_i000001" : ""),
                        date: res.data.date,
                        days: o.days
                    }, true);
            });
        }
    }
}

export class LocalDataAdapter extends DataAdapter {

    getDataByDate(data, date) {
        for (let i = data.length - 1; i >= 0; i--) {
            let d = data[i];
            if (d[0] <= date)
                return d;
        }
        return data[0];
    }

    getData(stockids?, startPts?): Promise<any> {
        // let _resolve;
        if (stockids == undefined) {
            stockids = ['000002', '000651', '600519', '600690', '600887', '601398', '601857', '601988'];
            stockids = math.randomArray(stockids);
        }
        let promise: Promise<any> = Promise.resolve();
        let datas = {};
        let etcs = {}
        for (let i = 0; i < this.mainScene.numTracks; i++) {
            // console.log(`/data/${stockids[i]}.json`);
            promise = promise.then(() => {
                return http.get(director.config.dataDomain + `${stockids[i]}.json`).then(data => {
                    let d = JSON.parse(data);
                    // datas.push(d.data.item);
                    datas[d.data.symbol] = d.data.item;
                    etcs[d.data.symbol] = {
                        pe: d.pe,
                        pb: d.pb,
                        inc: d.inc
                    };
                });
            });
        }
        return promise.then(() => {
            let numPts;// = 50;//CandleTrack.numHistoryPoints + this.mainScene.totalRound;

            for (let k in datas) {
                let d = datas[k];
                if (numPts == undefined)
                    numPts = this.mainScene.numHistoryPoints + this.mainScene.totalRound + 1;
                if (startPts == undefined)
                    startPts = math.randomInteger(d.length - numPts);
                if (this.dataDates == undefined) {
                    let dates = [];
                    for (let i = 0; i < numPts; i++) {
                        dates.push(d[startPts + i][0]);
                    }
                    this.dataDates = dates;
                } else {
                    let start = this.dataDates[0];
                    let end = this.dataDates[this.dataDates.length - 1];
                    for (let i = 0; i < d.length; i++) {
                        let date = d[i][0];
                        if (start < date && date < end && this.dataDates.indexOf(date) == -1) {
                            array.insertAsc(this.dataDates, date);
                        }
                    }
                }
            }
            // console.log(this.dataDates);
            let resData = {};
            for (let k in datas) {
                let d = datas[k];
                let newDatas = [];
                for (let i = 0; i < this.dataDates.length; i++) {
                    newDatas.push(this.getDataByDate(d, this.dataDates[i]));
                }
                // resData[k] = newDatas;
                resData[k] = {
                    data: newDatas,
                    etc: etcs[k]
                };
            }
            return resData;
        });
    }



}