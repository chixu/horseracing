import * as http from "./utils/http";
import * as director from "./core/director";
declare var md5;


let loginButton = document.getElementById('login');
let closeButton = document.getElementById('close');
let username: any = document.getElementById('username');
let password: any = document.getElementById('password');
let logpinPanel: any = document.getElementsByClassName("login-page")[0];

export class User {
    _unlockedLevel: number = 1;
    name: string;
    loginHandler;

    constructor() {
        this.loadCookie();
        loginButton.onclick = () => {
            let u = username.value.trim();
            let p = password.value.trim();
            if (u && p) {
                // http.post('http://192.168.0.136/game_login/login', {
                http.post(director.config.domain + 'login', {
                    user_name: u,
                    user_pwd: md5(p)
                }).then((res) => {
                    if (res == "null") {
                        alert("账号或密码错误");
                    } else {
                        let obj = JSON.parse(res);
                        this.setCookie('username', obj.username);
                        this.name = obj.username;
                        this.hideLogin();
                        if (this.loginHandler)
                            this.loginHandler();
                    }
                })
            } else {
                alert("请输入账号和密码");
            }
        }
        closeButton.onclick = () => {
            this.hideLogin();
        }
    }

    showLogin(cb?) {
        console.log('show mask');
        document.body.style.background = 'white';
        director.sceneManager.current.addMask(0xffffff);
        logpinPanel.style.display = 'block';
        this.loginHandler = cb;
    }

    hideLogin() {
        document.body.style.background = 'black';
        director.sceneManager.current.removeMask();
        logpinPanel.style.display = 'none';
    }

    get isLogin(): boolean {
        console.log(this.name);
        return this.name != "";
    }

    private loadCookie() {
        this.name = this.getCookie('username');
        if (localStorage.unlockedLevel == "undefined" || localStorage.unlockedLevel == undefined)
            localStorage.unlockedLevel = 1;
        this._unlockedLevel = parseInt(localStorage.unlockedLevel);
    }

    set unlockedLevel(v) {
        localStorage.unlockedLevel = this._unlockedLevel = v;
    }

    get unlockedLevel(): number {
        return this._unlockedLevel;
    }

    private setCookie(cname, cvalue, exdays = 7) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    private getCookie(cname) {
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
}
