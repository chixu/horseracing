// from https://github.com/primus/eventemitter3 v1.2.0

let has = Object.prototype.hasOwnProperty;

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
let prefix = typeof Object.create !== "function" ? "~" : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} [once=false] Only emit once
 * @api private
 */
class EE {
  constructor(public fn, public context, public once = false) { }
}

export default class EventEmitter {
  private _events;

  eventNames() {
    let events = this._events
      , names = []
      , name;
    if (!events) return names;
    for (name in events) {
      if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
    }
    // if (Object.getOwnPropertySymbols) {
    //   return names.concat(Object.getOwnPropertySymbols(events));
    // }
    return names;
  }

  listeners(event?: string, exists: boolean = false): any {
    let evt = prefix ? prefix + event : event
      , available = this._events && this._events[evt];

    if (exists) return !!available;
    if (!available) return [];
    if (available.fn) return [available.fn];
    let l = available.length;
    let ee = new Array(l);
    for (let i = 0; i < l; i++) {
      ee[i] = available[i].fn;
    }

    return ee;
  }

  emit(event: string, ...args: any[]): boolean {
    let evt = prefix ? prefix + event : event;

    if (!this._events || !this._events[evt]) return false;

    let listeners = this._events[evt]
      , len = args.length
      , i;

    if ("function" === typeof listeners.fn) {
      if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

      switch (len) {
        case 0: return listeners.fn.call(listeners.context), true;
        case 1: return listeners.fn.call(listeners.context, args[0]), true;
        case 2: return listeners.fn.call(listeners.context, args[0], args[1]), true;
        case 3: return listeners.fn.call(listeners.context, args[0], args[1], args[2]), true;
        case 4: return listeners.fn.call(listeners.context, args[0], args[1], args[2], args[3]), true;
        case 5: return listeners.fn.call(listeners.context, args[0], args[1], args[2], args[3], args[4]), true;
      }

      listeners.fn.apply(listeners.context, args);
    } else {
      let length = listeners.length
        , j;

      for (i = 0; i < length; i++) {
        if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

        switch (len) {
          case 0: listeners[i].fn.call(listeners[i].context); break;
          case 1: listeners[i].fn.call(listeners[i].context, args[0]); break;
          case 2: listeners[i].fn.call(listeners[i].context, args[0], args[1]); break;
          default:
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }

    return true;
  }

  on(event: string, fn: Function, context?: any): EventEmitter {
    let listener = new EE(fn, context || this)
      , evt = prefix ? prefix + event : event;

    if (!this._events) this._events = prefix ? {} : Object.create(null);
    if (!this._events[evt]) this._events[evt] = listener;
    else {
      if (!this._events[evt].fn) this._events[evt].push(listener);
      else this._events[evt] = [
        this._events[evt], listener
      ];
    }

    return this;
  }

  once(event: string, fn: Function, context?: any): EventEmitter {
    let listener = new EE(fn, context || this, true)
      , evt = prefix ? prefix + event : event;

    if (!this._events) this._events = prefix ? {} : Object.create(null);
    if (!this._events[evt]) this._events[evt] = listener;
    else {
      if (!this._events[evt].fn) this._events[evt].push(listener);
      else this._events[evt] = [
        this._events[evt], listener
      ];
    }

    return this;
  }

  removeListener(event: string, fn?: Function, context?: any, once?: boolean): EventEmitter {
    let evt = prefix ? prefix + event : event;

    if (!this._events || !this._events[evt]) return this;

    let listeners = this._events[evt]
      , events = [];

    if (fn) {
      if (listeners.fn) {
        if (
          listeners.fn !== fn
          || (once && !listeners.once)
          || (context && listeners.context !== context)
        ) {
          events.push(listeners);
        }
      } else {
        for (let i = 0, length = listeners.length; i < length; i++) {
          if (
            listeners[i].fn !== fn
            || (once && !listeners[i].once)
            || (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) {
      this._events[evt] = events.length === 1 ? events[0] : events;
    } else {
      delete this._events[evt];
    }

    return this;
  }

  removeAllListeners(event?: string): EventEmitter {
    if (!this._events) return this;

    if (event) delete this._events[prefix ? prefix + event : event];
    else this._events = prefix ? {} : Object.create(null);

    return this;
  }

  off = this.removeListener;

}
