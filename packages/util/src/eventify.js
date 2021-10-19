const Events = {

  allow: function (eventName) {
    this.listeners = this.listeners || {};
    this.listeners[eventName] = [];
  },

  on: function (eventName, fn) {
    if (typeof this.listeners[eventName] === 'undefined') {
      throw new Error(`Unregistered event name "${eventName}"`);
    }

    this.listeners[eventName].push(fn);
  },

  emit: function(eventName, payload) {
    const listeners = (this.listeners || {})[eventName];

    if (typeof listeners === 'undefined') {
      throw new Error(`Unregistered event name "${eventName}"`);
    }

    // Early return for no listeners
    if (listeners.length === 0) {
      return;
    }

    // if (this.logger) {
    //   this.logger.debug(`emit ${eventName} to ${this.listeners[eventName].length} listener(s)`);
    // }
    // else {
    //   console.log(`emit ${eventName} to ${this.listeners[eventName].length} listener(s)`);
    // }

    (this.listeners[eventName] || []).forEach(async (fn) => {
      fn(payload);
    });
  },

  off: function(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName].filter((listener) => {
      return fn !== listener;
    });
  },

  once: function(eventName, fn) {
    const listener = function (payload) {
      fn(payload);
      this.off(eventName, listener);
    }.bind(this);

    this.on(eventName, listener);
  }

}

export const eventify = (obj) => {
  [
    'on',
    'allow',
    'emit',
    'once',
    'off'
  ].forEach((fnName) => {
    if (typeof obj[fnName] !== 'undefined') {
      throw new TypeError(`Object already has a ${fnName} property.`);
    }

    obj[fnName] = Events[fnName];//.bind(obj);
  });

  return obj;
}