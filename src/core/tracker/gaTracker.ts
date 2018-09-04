import { Listener } from "./tracker";

export class GATracker implements Listener {

  _ga;

  constructor() {
    
  }

  get ga(){
    if(this._ga) return this._ga;
    if (window['ga'] && window['ga']['getAll']) {
      this._ga = window['ga'].getAll()[0];
      return this._ga;
    }
    return undefined;
  }
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
    if (!this.ga || !data.cat) return;
    console.log('ga event', data);
    // ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
    this.ga.send('event', data.cat, data.action, data.label, data.value);
  }

  setUser(name) {
    if (!this.ga) return;
    console.log('ga userId', name);
    this.ga.set('userId', name);
  }
}
