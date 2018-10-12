import * as http from "./utils/http";
import * as math from "./utils/math";
import * as director from "./core/director";

// console.log(CryptoJS.enc.Base64.parse("us5N0PxHAWuIgb0/Qc2sh5OdWBbXGady").toString());
// let  = CryptoJS.enc.Base64.parse("zAvR2NI87bBx746n");
let SECURITY_KEY = CryptoJS.enc.Utf8.parse("FbcCY2yCFBwVCUE9R+6kJ4fAL4BJxxjd");
let SECURITY_IV = CryptoJS.enc.Utf8.parse("e16ce913a20dadb8");


function encrypt(msg: string): string {
    let encrypted = CryptoJS.AES.encrypt(msg, SECURITY_KEY, {
        iv: SECURITY_IV
    });
    return encrypted + "";
}

function decrypt(msg: string): string {
    let decrypted = CryptoJS.AES.decrypt(msg, SECURITY_KEY, {
        // keySize: 16,
        iv: SECURITY_IV,
        mode: CryptoJS.mode.CBC,
        // padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
window['decrypt'] = decrypt;
window['encrypt'] = encrypt;

export class Request {
    // private _domain = ""

    constructor() {
        // this.domain = ;
    }

    // private get domain()

    private getUrl(api, data?, stricturl = false) {
        // let url = director.config.apiDomain + api + (director.config.env == 'dev' ? ".php" : "");
        let url = director.config.apiDomain + api;
        if (stricturl)
            url = api;
        if (data) {
            // url += '?d=';
            let str = "";
            for (let k in data) {
                str += k + '=' + encodeURIComponent(data[k]) + '&';
            }
            // return url + '?d=' + encodeURIComponent(encrypt(str.substr(0, url.length - 1)));
            return url + '?' + str.substr(0, str.length - 1);
        } else
            return url;
    }

    get(api, data={}, stricturl = false) {
        // console.log(this.getUrl(api, data));
        return http.get(this.getUrl(api, data, stricturl))
            .then((res) => {
                let r;
                // console.log(res);
                try {
                    r = JSON.parse(res);
                } catch{
                    r = {
                        err: res
                    }
                }
                return r;
            });
    }

    post(api, data, enc = true) {
        if (enc) {
            let str = String.fromCharCode(math.randomInteger(48, 122)) + JSON.stringify(data);
            // let str = JSON.stringify(data);
            // console.log(str);
            // console.log(encrypt(str));
            data = { data: encodeURIComponent(encrypt(str))};
        }
        return http.post(this.getUrl(api), data)
            .then((res) => {
                let r;
                // console.log(res);
                try {
                    r = JSON.parse(res);
                } catch{
                    r = {
                        err: res
                    }
                }
                return r;
            });
    }
}
