export class User {
    _unlockedLevel: number = 1;

    constructor() {
        this.load();
    }

    load() {
        if (localStorage.unlockedLevel == "undefined" || localStorage.unlockedLevel == undefined)
            localStorage.unlockedLevel = 1;
        console.log(localStorage);
        this._unlockedLevel = parseInt(localStorage.unlockedLevel);
    }

    set unlockedLevel(v) {
        localStorage.unlockedLevel = this._unlockedLevel = v;
    }

    get unlockedLevel(): number {
        return this._unlockedLevel;
    }
}
