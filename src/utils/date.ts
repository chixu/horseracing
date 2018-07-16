import * as string from './string';

export function dateToYYYYmmdd(date: Date, d: string = ''): string {
    return date.getFullYear() + d + string.pad(date.getMonth() + 1, 2) + d + string.pad(date.getDate(),2);
}

export function dateToYYmmdd(date: Date, d: string = ''): string {
    return date.getFullYear().toString().substr(2) + d + string.pad(date.getMonth() + 1, 2) + d + string.pad(date.getDate(),2);
}

// if (!String.prototype['padStart']) {
//     String.prototype['padStart'] = function padStart(targetLength,padString) {
//         targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
//         padString = String((typeof padString !== 'undefined' ? padString : ' '));
//         if (this.length > targetLength) {
//             return String(this);
//         }
//         else {
//             targetLength = targetLength-this.length;
//             if (targetLength > padString.length) {
//                 padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
//             }
//             return padString.slice(0,targetLength) + String(this);
//         }
//     };
// }