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


export function getQueryString(name, url?) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



export function setCookie(cname, cvalue, exSec = 600) {
    var d = new Date();
    d.setTime(d.getTime() + (exSec * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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