import * as http from "./utils/http";
import * as director from "./core/director";

// console.log(CryptoJS.enc.Base64.parse("us5N0PxHAWuIgb0/Qc2sh5OdWBbXGady").toString());
// let  = CryptoJS.enc.Base64.parse("zAvR2NI87bBx746n");
let SECURITY_KEY = "bace4dd0fc47016bbace4dd0fc47016b";
let SECURITY_IV = "cc0bd1d8d23cedb0";
function encrypt(msg: string): string {
    let encrypted = CryptoJS.AES.encrypt(msg, SECURITY_KEY, {
        iv: SECURITY_IV
    });
    return encrypted + "";
}

function decrypt(msg: string): string {
    let decrypted = CryptoJS.AES.decrypt(msg, SECURITY_KEY, {
        keySize: 16,
        iv: SECURITY_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export class Request {
    // private _domain = ""

    constructor() {
        // this.domain = ;
    }

    // private get domain()

    private getUrl(api, data?) {
        let url = director.config.apiDomain + api + (director.config.env == 'dev' ? ".php" : "");
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

    get(api, data) {
        return http.get(this.getUrl(api, data))
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

    post(api, data) {
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
