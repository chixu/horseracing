import { Listener } from "./tracker";
declare var appInsights;

export class AppInsightsTracker implements Listener {

  constructor() {

  }

  // tracker.event({
  //   name: 'spin',
  //   properties: {
  //     "Spin mode": this.scene.isFreeSpin ? 'Freespin' : (this.scene.isAutoSpin ? 'Autospin' : 'Normal'),
  //     "Muted": this.scene.soundService.muted ? "True" : "False",
  //     "Orientation": this.scene.isPortraitLayout ? "Portrait" : "Landscape",
  //     "Game mode": this.scene.context.FUNPLAY ? 'Fun' : "Real",
  //     "Platform": director.device.platform,
  //     "Currency": this.player.currency,
  //     "Fround": this.player.froundOn ? "True" : "False",
  //     "Bonus bet": this.player.bonusBet ? "True" : "False",
  //     "Bonus ID": this['bonusID'] || "-1"
  //   },
  //   measurements: {
  //     "Win": rsp.win,
  //     "Bet": this.player.betValue
  //   }
  // })
  //   track(data) {
  //     if (!this.ga) {
  //       return;
  //     }
  //     let type = data.type;
  //     let d = data.data;
  //     if (type === TrackEvent.Event) {
  //       this.event(d);
  //     }
  //   }

  event(data) {
    if (!appInsights || !data.name) return;
    appInsights.trackEvent(data.name, data.properties, data.measurements);
  }

  setUser(name) {
    if (!appInsights) return;
    appInsights.trackEvent('Login', { 'Name': name });
  }
}
