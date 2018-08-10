// import * as array from "./array";


export function get(url) {
    return new Promise<string>(resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                // console.log(xhr.responseText);
                // var resp = JSON.parse();
                // console.log(resp);
                resolve(xhr.responseText);
            }
            // console.log(xhr.readyState);
        }
        xhr.send();
    });
}

export function post(url, args) {
    return new Promise<string>(resolve => {
        var xhr = new XMLHttpRequest();
        var params = '';
        for (let k in args) {
            params += k + '=' + args[k] + '&';
        }
        if (params) params = params.substr(0, params.length - 1);
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // JSON.parse does not evaluate the attacker's scripts.
                // console.log(xhr.responseText);
                // var resp = JSON.parse();
                // console.log(resp);
                resolve(xhr.responseText);
            }
            // console.log(xhr.readyState);
        }
        xhr.send(params);
    });
}


// export function post(url: string, args?) {
//     return new Sender(true).post(url, args);
// }

// export function parseUri(url: string) {
//     let a = document.createElement("a");
//     a.href = url;
//     return a;
// }

// export function parseDomain(hostname: string) {
//     let host = hostname || "";
//     let segs = host.split(".");
//     let l = segs.length;
//     if (l > 1) {
//         return `${segs[l - 2]}.${segs[l - 1]}`;
//     }
//     return host;
// }