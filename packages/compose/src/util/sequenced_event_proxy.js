import { Logger } from "@composer/util";

export class SequencedEventProxy {

  static create(obj, { methods, aliases }) {
    const proxy = class Proxy extends this {
      static methods = methods || [];
      static aliases = aliases || [];
    };

    return proxy.observe(obj, methods);
  }

  static observe(obj, target) {
    obj.sequencerProxy = this;

    (Array.isArray(target) ? target : [ target ]).forEach((method) => {
      this.observeMethod(obj, method);
    });

    return this;
  }

  static observeMethod(obj, method) {
    const ProxyClass = this;
    const fn = obj.prototype[method];

    this.prototype[method] = function () {
      return this.obj[method].apply(this.obj, [ ...arguments ].concat([ this ]));
    }

    obj.prototype[method] = function () {
      const args = [ ...arguments ];
      const proxy = args.pop();

      if (!(proxy instanceof ProxyClass)) {
        throw new TypeError(`${method}() must be scoped to a position (i.e. by using at())`);
      };

      fn.apply(this, arguments);
  
      return proxy;
    }
  }

  get aliases () {
    return this.constructor.aliases;
  }

  constructor(obj, data) {
    this.obj = obj;
    this.data = data;
    this.logger = new Logger(`${obj.constructor.name}${this.constructor.name}`);
    
    this.initializeAliases();
  }

  // Aliases make things like track.at.measure(0).play.phrase() reference the
  // correct methods.  The goal of aliases is to create human language-y code.
  initializeAliases() {
    this.aliases.forEach(({ attachTo, name, target }) => {
      this[attachTo][name] = this[target].bind(this);
    });
  }
}