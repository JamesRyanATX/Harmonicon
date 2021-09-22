import { Logger } from '@composer/util';
import { ComposerError } from './errors';

export class BaseComposer {
  static composerContextName = 'base';
  static model = null;

  static compose(name, builder, context) {
    const composer = new this(name, builder, context);

    composer.begin();
    composer.load();
    composer.evaluate();
    composer.finish();

    return composer;
  }

  /**
   * Return an composer function bound to composer class
   */
  static composer() {
    return this.compose.bind(this);
  }

  /**
   * @ignore
   */
  constructor(name, builder, context) {
    this.name = name;
    this.builder = builder;
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

  load() {
    this.model = this.context.model || new this.constructor.model({
      name: this.name
    });
  }

  evaluate () {
    let result;

    try {
      result = this.builder.call(this, this.context);
    }
    catch (e) {
      this.logger.error(`${this.constructor.name}: ${e.message}`);
      throw e;  
    }
    
    if (result instanceof Promise) {
      throw new ComposerError(`Builder functions must be syncronous and not return promises.`)
    }
  }

  begin () {
  }

  finish () {
  }

}