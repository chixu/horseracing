import * as director from "../director";
import * as array from "../../utils/array";
// import { Tracking, Identify, HitType, StartScreen, StopScreen, ScreenView, PageView, Event, Timing, Metric, Exception, Request, Response } from "./types";

export interface Listener {
  // initialize(): void;
  event(data): void;
  setUser(name): void;
}

// export enum TrackEvent {
//   Event,
//   SceneEnter,
//   SceneExit,
//   Metric
// }

export class Tracker {
  private listeners: Listener[] = [];

  addListener(listener: Listener) {
    this.listeners.push(listener);
  }

  removeListener(listener: Listener) {
    array.remove(this.listeners, listener);
  }

  // scene(screen?: ScreenView) {
  //   if (isBlank(screen)) {
  //     screen = {
  //       name: director.sceneManager.current.id
  //     };
  //   }
  //   this.track(HitType.ScreenView, screen);
  // }

  // sceneEnter(event) {
  //   this.track(TrackEvent.SceneEnter, event);
  // }

  // sceneExit(event) {
  //   this.track(TrackEvent.SceneExit, event);
  // }

  // metric(event) {
  //   this.track(TrackEvent.Metric, event);
  // }

  event(data: any) {
    // this.track(TrackEvent.Event, {
    //   name: name, value: data
    // });

    for (let listener of this.listeners) {
      listener.event(data);
    }
  }

  setUser(name) {
    for (let listener of this.listeners) {
      listener.setUser(name);
    }
  }

  // private track(type: TrackEvent, data?: any) {
  //   let d = {
  //     // time: date.nowMillis(),
  //     type: type,
  //     // userID: app.USER_ID,
  //     data: data
  //   };
  //   for (let listener of this.listeners) {
  //     listener.track.call(listener, d);
  //   }
  // }
}