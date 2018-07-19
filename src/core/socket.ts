
export class Command {
    public static readonly createRoom: string = 'cr';
    public static readonly getLobbyInfo: string = 'li';
    public static readonly joinRoom: string = 'jr';
    public static readonly leaveRoom: string = 'lr';
    public static readonly getRoomInfo: string = 'ri';
    public static readonly keepConnection: string = 'c';
    public static readonly startGame: string = 'sg';
    public static readonly gameInfo: string = 'gi';
    public static readonly gameOver: string = 'go';
    public static readonly nextRound: string = 'nr';
}


export class Socket {
    websocket: WebSocket;
    callbacks = {};
    keepConnection: number;
    prevData: any;

    constructor() {

    }
    on(cmd, cb) {
        this.callbacks[cmd] = cb;
    }

    off(cmd) {
        delete this.callbacks[cmd];
    }

    send(cmd, data?) {
        if (cmd != 'c')
            console.log('sending :', cmd, data);
        let d: any = {
            c: cmd
        };
        if (data != undefined)
            d.data = data;
        this.websocket.send(JSON.stringify(d));
    }

    init(url?) {
        let _resolve;
        if (this.websocket == undefined) {
            url = url || "ws://192.168.0.121:8081";
            let websocket = new WebSocket(url);
            // websocket.setTimeout(0);
            console.log(websocket);
            console.log(websocket['setTimeout']);
            //Connected to server
            websocket.onopen = function (ev) {
                console.log('Connected to server ');
                _resolve();
            }

            //Connection close
            websocket.onclose = (ev) => {
                console.log('Disconnected');
                clearInterval(this.keepConnection);
            };

            //Message Receved
            websocket.onmessage = (ev) => {
                console.log('Message ' + ev.data);
                try {
                    let d = JSON.parse(ev.data);
                    if (d.c) {
                        let cb = this.callbacks[d.c];
                        this.prevData = d.data;
                        if (cb)
                            cb(d.data);
                    }
                } catch (e) {

                }
            };

            //Error
            websocket.onerror = function (ev) {
                console.log('Error ' + ev);
            };
            this.websocket = websocket;

            this.keepConnection = setInterval(() => {
                this.send('c');
            }, 5000);
            return new Promise((resolve) => _resolve = resolve);
        } else
            return Promise.resolve();
    }
}