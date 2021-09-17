const Events = {

  allow: function (eventName) {
    this.listeners[eventName] = [];
  },

  on: function (eventName, fn) {
    if (typeof this.listeners[eventName] === 'undefined') {
      throw new Error(`Unregistered event name "${eventName}"`);
    }

    this.listeners[eventName].push(fn);
  },

  emit: function(eventName, payload) {
    if (typeof this.listeners[eventName] === 'undefined') {
      throw new Error(`Unregistered event name "${eventName}"`);
    }

    // console.log(`emit ${eventName} to ${this.listeners[eventName].length} listener(s)`);

    (this.listeners[eventName] || []).forEach((fn) => {
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
  obj.listeners = {};

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

    obj[fnName] = Events[fnName].bind(obj);
  });

  return obj;
}