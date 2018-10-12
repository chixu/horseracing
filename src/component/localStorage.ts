
import * as director from "../core/director";

export function has(prop): boolean {
    return localStorage[prop] != "undefined" && localStorage[prop] !== undefined && localStorage[prop] !== "";
}

export function get(prop) {
    return localStorage[prop];
}

export function getNum(prop) {
    return parseFloat(get(prop));
}

export function getJson(prop) {
    return JSON.parse(get(prop));
}

export function set(prop, value) {
    return localStorage[prop] = value;
}

export function getRecord(level) {
    if (has('l' + level)) {
        return getJson('l' + level);
    } else {
        return undefined;
    }
}

export function clearRecord(level) {
    set('l' + level, '');
}

export function setRecord(data) {
    let preData = getRecord(data.level);
    if (preData) {
        let time = preData.time;
        let score = preData.value;
        let cur = new Date().getTime();
        let day = 24 * 60 * 60 * 1000;
        if ((data.value > score && cur - time < day) || cur - time > day) {
            data['time'] = cur;
            set('l' + data.level, JSON.stringify(data));
        }
    } else {
        data['time'] = new Date().getTime();
        set('l' + data.level, JSON.stringify(data));
    }
}

export function uploadRecord(level) {
    let data = getRecord(level);
    if (data != undefined && director.user.isLogin) {
        let oneHour = 60 * 60 * 1000;
        let cur = new Date().getTime();
        if (cur - data.time < oneHour) {
            data.user = director.user.name;
            director.request.post('upload_score', data);
            clearRecord(level);
            return data;
        }
    }
    return undefined;
}