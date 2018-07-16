export function sortAsc(arr, prop) {
    return arr.concat().sort(function (a, b) { return (a[prop] > b[prop]) ? 1 : ((b[prop] > a[prop]) ? -1 : 0); });
}

export function sortDesc(arr, prop) {
    return arr.concat().sort(function (a, b) { return (a[prop] < b[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0); });
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