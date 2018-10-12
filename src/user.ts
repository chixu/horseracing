import * as http from "./utils/http";
import * as math from "./utils/math";
import * as director from "./core/director";
import * as lStorage from "./component/LocalStorage";
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
                        // http.setCookie('username', obj.username, 60 * 60 * 24 * 3);
                        // this.name = obj.username;
                        this.setName(obj.username);
                        this.loadUserInfo().then(() => {
                            this.hideLogin();
                            if (this.loginHandler)
                                this.loginHandler();
                        })
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
            // window.top.location.href = window.location.origin + "/login.html";
            window.top['redirect']();
            //alert("请先登录海知平台");
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

    public loadUserInfo() {
        let promise = Promise.resolve();
        let maxLevel = 0;
        // if (http.getQueryString('login')) {
        for (let i = 1; i < director.config.game.totalLevel; i++) {
            let data = lStorage.uploadRecord(i);
            if (data) {
                maxLevel = data.rank == 1 ? data.level + 1 : data.level;
            }
        }
        if (maxLevel > 0)
            promise = promise.then(() => director.request.post('update_user_info', { level: maxLevel }));
        // }
        return promise.then(() => director.request.get('get_user_info').then(d => {
            this._unlockedLevel = parseInt(d.data.level);
        }));
    }

    public setName(name) {
        this.name = name;
        if (name) {
            director.tracker.setUser(name);
        } else {
            director.tracker.setUser("Guest" + math.randomInteger(999999));
        }
    }

    public load(): Promise<any> {
        // if (director.config.platform == 'web')
        //     this.setName(http.getQueryString('username'));
        // else
        //     this.setName(http.getCookie('username'));
        return director.request.get("get_user").then(res => {
            if(res.err){
                if (!lStorage.has('unlockedLevel'))
                lStorage.set('unlockedLevel', 1);
                this._unlockedLevel = lStorage.getNum('unlockedLevel');
            }else{
                this.setName(res.name);
                return this.loadUserInfo();
            }
        })
        // if (this.name) {
        //     return this.loadUserInfo();
        // } else {
        //     if (!lStorage.has('unlockedLevel'))
        //         lStorage.set('unlockedLevel', 1);
        //     this._unlockedLevel = lStorage.getNum('unlockedLevel');
        //     return Promise.resolve();
        // }
    }

    set unlockedLevel(v) {
        this._unlockedLevel = v;
        lStorage.set('unlockedLevel', v);
        if (this.name) {
            director.request.post('update_user_info', { level: v });
        }
    }

    get unlockedLevel(): number {
        // console.log(this._unlockedLevel);
        return this._unlockedLevel;
    }

}
