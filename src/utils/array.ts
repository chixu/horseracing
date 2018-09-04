export function sortAsc(arr, prop) {
    return arr.concat().sort(function (a, b) { return (a[prop] > b[prop]) ? 1 : ((b[prop] > a[prop]) ? -1 : 0); });
}

export function sortDesc(arr, prop) {
    return arr.concat().sort(function (a, b) { return (a[prop] < b[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0); });
}

//4 decim
export function sortAscApprox(arr, prop, decimal = 4) {
    return arr.concat().sort(function (a, b) {
        let div = Math.pow(10, decimal);
        let aa = Math.round(div * a[prop])/div;
        let bb = Math.round(div * b[prop])/div;
        return (aa > bb) ? 1 : ((bb > aa) ? -1 : 0);
    });
}

export function sortDescApprox(arr, prop, decimal = 4) {
    return arr.concat().sort(function (a, b) {
        let div = Math.pow(10, decimal);
        let aa = Math.round(div * a[prop])/div;
        let bb = Math.round(div * b[prop])/div;
        return (aa < bb) ? 1 : ((bb < aa) ? -1 : 0);
    });
}

export function insertAsc(arr: any[], element) {
    if (arr == undefined) return;
    if (arr == []) return [element];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > element) {
            arr.splice(i, 0, element);
            return;
        }
    }
    arr.push(element);
}

export function remove<T>(arr: T[], object: T) {
    let i = arr.indexOf(object);
    if (i >= 0) {
        arr.splice(i, 1);
    }
}