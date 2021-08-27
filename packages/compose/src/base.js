import { Logger } from '@composer/util';

export class BaseComposer {
  static composerContextName = 'base';
  static model = null;
  static initialized = false;

  static async compose(name, fn, context) {
    if (!this.initialized) {
      await this.initialize();
    }

    const composer = new this(name, fn, context);

    await composer.load();
    await composer.evaluate();

    return composer;
  }

  /**
   * Return an composer function bound to composer class
   */
  static composer() {
    return (async function () {
      return this.compose.apply(this, arguments);
    }).bind(this);
  }

  /**
   * 
   */
  static async initialize () {
    this.initialized = true;
  }

  constructor(name, fn, context) {
    this.name = name;
    this.fn = fn;
    this.context = Object.assign({
      [this.constructor.composerContextName]: this
    }, context);

    this.constructor.current = this;
    this.logger = new Logger(this.constructor.name);

    if (this.constructor.proxies) {
      this.createProxies();
    }
  }

  createProxies() {
    const proxies = this.constructor.proxies;

    Object.keys(proxies).forEach((attachTo) => {
      Object.keys(proxies[attachTo]).forEach((proxyName) => {
        this.createProxy(attachTo, proxyName, proxies[attachTo][proxyName]);
      });
    });
  }

  createProxy(attachTo, proxyName, fn) {
    this[attachTo][proxyName] = function () {
      return fn.apply(this, arguments);
    }.bind(this)
  }

  async load() {
    this.model = this.context.model || new this.constructor.model({
      name: this.name
    });
  }

  async evaluate () {
    try {
      return await this.fn.call(this, this.context);
    }
    catch (e) {
      this.logger.error(`${this.constructor.name}: ${e.message}`);
      throw e;
    }
  }

}