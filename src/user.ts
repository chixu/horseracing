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
        loginButton.onclick = () => {
            let u = username.value.trim();
            let p = password.value.trim();
            if (u && p) {
                // http.post('http://192.168.0.136/game_login/login', {
                http.post(director.config.apiDomain + 'login', {
                    user_name: u,
                    user_pwd: md5(p)
                }).then((res) => {
                    if (res == "null") {
                        alert("账号或密码错误");
                    } else {
                        let obj = JSON.parse(res);
                        http.setCookie('username', obj.username);
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
        if (director.config.platform == 'web') {
            // window.top.location.href = window.location.origin + "/login";
            alert("请先登录海知平台");
        } else {
            document.body.style.background = 'white';
            director.sceneManager.current.addMask(0xffffff);
            logpinPanel.style.display = 'block';
            this.loginHandler = cb;
        }
    }

    hideLogin() {
        document.body.style.background = 'black';
        director.sceneManager.current.removeMask();
        logpinPanel.style.display = 'none';
    }

    get isLogin(): boolean {
        // console.log(this.name);
        return this.name != undefined && this.name != "";
    }

    public load(): Promise<any> {
        if (director.config.platform == 'web')
            this.name = http.getQueryString('username');
        else
            this.name = http.getCookie('username');

        if (this.name) {
            return director.request.get('get_user_info', { user: this.name }).then(d => {
                console.log(d);
                this._unlockedLevel = parseInt(d.data.level);
            });
        } else {
            if (localStorage.unlockedLevel == "undefined" || localStorage.unlockedLevel == undefined)
                localStorage.unlockedLevel = 1;
            this._unlockedLevel = parseInt(localStorage.unlockedLevel);
            return Promise.resolve();
        }
    }

    set unlockedLevel(v) {
        localStorage.unlockedLevel = this._unlockedLevel = v;
        if (this.name) {
            director.request.get('update_user_info', { user: this.name, level: v });
        }
    }

    get unlockedLevel(): number {
        console.log(this._unlockedLevel);
        return this._unlockedLevel;
    }

}
