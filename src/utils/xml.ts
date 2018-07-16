// import { isPresent } from "../core/lang";
// import { Point, Size } from "./math";

// export enum Unit {
//   PERCENT,
//   PIXEL
// }

// export interface UnitNumber {
//   unit?: Unit;
//   value: number;
// }

export function forEachElement(root: Node, handler: (curr: Element, i: number) => void) {
  if (!root) {
    return;
  }
  let nodes = root.childNodes;
  let count = nodes.length;
  for (let i = 0; i < count; i++) {
    let node = root.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      handler(node as Element, i);
    }
  }
}

export function lastElement(root: Node) {
  if (!root) {
    return;
  }
  let nodes = root.childNodes;
  let node;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType === Node.ELEMENT_NODE) {
      node = nodes[i];
    }
  }
  return node;
}

// export function getChildById(root: Node, name: string) {
//   let nodes = root.childNodes;
//   for (let i = 0; i < nodes.length; i++) {
//     let node = root.childNodes[i];
//     if (node.nodeType === Node.ELEMENT_NODE && id(node) === name) {
//       return node as Element;
//     }
//   }
//   return undefined;
// }

export function forEachElementReverse(root: Node, handler: (curr: Element, i: number) => void) {
  if (!root) {
    return;
  }
  let nodes = root.childNodes;
  let count = nodes.length;
  for (let i = count - 1; i >= 0; i--) {
    let node = root.childNodes[i];
    if (node.nodeType === Node.ELEMENT_NODE) {
      handler(node as Element, i);
    }
  }
}

export function has(node: Element, key: string): boolean {
  return node.attributes[key];
}

export function attr(node: Element, key: string, defaultValue = undefined): any {
  if (!node) {
    return defaultValue;
  }
  if (node.attributes[key]) {
    return node.attributes[key].value;
  }
  return defaultValue;
}

export function id(node: Element, defaultValue: string = ""): string {
  return attr(node, "id", defaultValue);
}

export function name(node: Element, defaultValue: string = ""): string {
  return attr(node, "name", defaultValue);
}

export function num(node: Element, key: string, defaultValue: number = 0): number {
  return +attr(node, key, defaultValue);
}

// export function unit(node: Node, key: string): UnitNumber {
//   //let unit = undefined;
//   let str: string = attr(node, key, "");
//   return stringToUnitNumber(str);
// }

// function stringToUnitNumber(str: string): UnitNumber {
//   str = str.replace(" ", "");
//   if (!str) return { value: 0 };
//   if (str.indexOf("%") > -1) return { value: Number(str.substr(0, str.length - 1)) / 100, unit: Unit.PERCENT };
//   if (str.indexOf("px") > -1) return { value: +(str.substr(0, str.length - 2)), unit: Unit.PIXEL };
//   return { value: +str, unit: Unit.PIXEL };
// }

// export function unitPair(node: Node, key: string): [UnitNumber, UnitNumber] {
//   let arr = str(node, key, "0").split(",");
//   let rect: [UnitNumber, UnitNumber] = [{ value: 0 }, { value: 0 }];
//   for (let i = 0; i < arr.length; i++) {
//     rect[i] = stringToUnitNumber(arr[i]);
//   }
//   return rect;
// }

export function str(node: Element, key: string, defaultValue: string = ""): string {
  return attr(node, key, defaultValue);
}

export function bool(node: Element, key: string, defaultValue: boolean = false): boolean {
  return str(node, key, defaultValue ? "true" : "false").toLowerCase() === "true";
}

export function value(node: Element, defaultValue: string = ""): string {
  return node ? node.textContent : defaultValue;
}

export function isSimpleElement(node: Element): boolean {
  return node.attributes.length === 0 && node.childElementCount === 0;
}

export function numbers(node: Element, key: string, len?: number): number[] {
  let value = str(node, key);
  let arr;
  if (value)
    arr = value.split(",");
  else
    return [];
  len = len ? len : arr.length;
  let numbers: number[] = new Array(len);
  for (let i = 0; i < len; i++) {
    numbers[i] = parseFloat(arr[i]);
  }
  return numbers;
}

// export function point(node: Node, key: string, defaultValue: [number, number] = [0, 0]): [number, number] {
//   let arr = str(node, key, "0").split(",");
//   let rect: [number, number] = defaultValue;
//   for (let i = 0; i < arr.length; i++) {
//     rect[i] = parseFloat(arr[i]);
//   }
//   return rect;
// }

// export function point2(node: Node, key: string): Point {
//   let arr = str(node, key, "0").split(",");
//   return {
//     x: parseFloat(arr[0]),
//     y: parseFloat(arr[1])
//   };
// }

// export function size(node: Node, key: string): Size {
//   let arr = numbers(node, key, 2);
//   return { width: arr[0], height: arr[1] };
// }

// export function rect(node: Node, key: string): [number, number, number, number] {
//   let arr = str(node, key, "0").split(",");
//   let rect: [number, number, number, number] = [0, 0, 0, 0];
//   for (let i = 0; i < arr.length && i < 4; i++) {
//     rect[i] = parseFloat(arr[i]);
//   }
//   return rect;
// }

// export function rect2(node: Node, key: string): PIXI.Rectangle {
//   let r = rect(node, key);
//   return new PIXI.Rectangle(r[0], r[1], r[2], r[3]);
// }

// export function textStyle(node: Node) {
//   return {
//     align: str(node, "align", "left"),
//     breakWords: bool(node, "breakWords", false),
//     fontFamily: str(node, "fontFamily"),
//     fontSize: num(node, "fontSize"),
//     fontStyle: str(node, "fontStyle", "normal"),
//     fontVariant: str(node, "fontVariant", "normal"),
//     fontWeight: str(node, "fontVariant", "normal"),
//     fill: num(node, "fill", 0xffffff),
//     fillGradientType: num(node, "fillGradientType", 0), // 0 or 1 (LINEAR_VERTICAL or LINEAR_HORIZONTAL)
//     stroke: num(node, "stroke", 0),
//     strokeThickness: num(node, "strokeThickness", 0),
//     wordWrap: bool(node, "wordWrap", false),
//     wordWrapWidth: num(node, "wordWrapWidth", 100),
//     dropShadow: bool(node, "dropShadow", false),
//     dropShadowColor: str(node, "dropShadowColor", "#000000"),
//     dropShadowBlur: num(node, "dropShadowBlur", 0),
//     dropShadowAngle: num(node, "dropShadowAngle", Math.PI / 6),
//     dropShadowDistance: num(node, "dropShadowDistance", 5),
//     padding: num(node, "padding", 0),
//     textBaseline: str(node, "textBaseline", "alphabetic"),
//     miterLimit: num(node, "miterLimit", 10),
//     lineJoin: str(node, "lineJoin", "miter"),
//     letterSpacing: num(node, "letterSpacing", 0),
//     lineHeight: num(node, "lineHeight", 0)
//   };
// }

// export let parse: (x: string) => Element = (() => {
//   if (DOMParser) {
//     let parser = new DOMParser();
//     return (x: string) => parser.parseFromString(x, "text/xml").documentElement;
//   } else {
//     if (typeof ActiveXObject !== "undefined") {
//       return (x: string) => {
//         let parser = new ActiveXObject("Microsoft.XMLDOM");
//         parser.async = "false";
//         parser.loadXML(x);
//         return parser;
//       };
//     }
//   }
//   return x => undefined;
// })();
