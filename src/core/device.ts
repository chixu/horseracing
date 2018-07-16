declare var is;

export class Platform {
  static desktop: string = "desktop";
  static web: string = "web";
  static mini: string = "mini";
  static mobile: string = "mobile";
}

export class Device {
  ie: boolean = false;
  ieVersion: number = 0;
  android: boolean = false;
  chrome: boolean = false;
  windowsPhone: boolean = false;

  constructor() {
    this.checkOS();
    this.checkBrowser();
  }

  checkOS() {
    let ua = navigator.userAgent;
    if (/Android/.test(ua)) {
      this.android = true;
    }
    if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
      this.android = false;
      // device.iOS = false;
      // device.macOS = false;
      // device.windows = true;
      this.windowsPhone = true;
    }
  }

  checkBrowser() {
    let ua = navigator.userAgent;
    if (/Chrome\/(\d+)/.test(ua) && !this.windowsPhone) {
      this.chrome = true;
    } else if (/MSIE (\d+\.\d+);/.test(ua)) {
      this.ie = true;
      this.ieVersion = parseInt(RegExp.$1, 10);
    } else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua)) {
      this.ie = true;
      //device.trident = true;
      //device.tridentVersion = parseInt(RegExp.$1, 10);
      this.ieVersion = parseInt(RegExp.$3, 10);
    }
  }

  get isUCBrowser(): boolean {
    return navigator.userAgent.toLowerCase().indexOf("ucbrowser") > -1;
  }

  get isQQBrowser(): boolean {
    return navigator.userAgent.toLowerCase().indexOf("qqbrowser") > -1;
  }

  get isXiaoMiBrowser(): boolean {
    return navigator.userAgent.toLowerCase().indexOf("xiaomi") > -1;
  }

  get desktop(): boolean {
    return is.desktop();
  }

  get mobile(): boolean {
    return is.mobile();
  }

  get tablet(): boolean {
    return is.tablet();
  }

  platform: Platform | string;
};
