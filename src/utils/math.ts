export function randomInteger(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function randomFloat(max: number, min: number = 0) {
    return Math.random() * (max - min) + min;
}

export function randomArray(arr: any[]) {
    let a = [];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let ranIdx = randomInteger(arr.length);
        a.push(arr.splice(ranIdx, 1)[0]);
    }
    return a;
}



