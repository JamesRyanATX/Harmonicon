import { Logger } from '@composer/util';

export class BaseComposer {
  static composerContextName = 'base';
  static model = null;

  static async compose(name, fn, context) {
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

  constructor(name, fn, context) {
    this.name = name;
    this.fn = fn;
    this.context = Object.assign({
      [this.constructor.composerContextName]: this
    }, context);

    this.constructor.current = this;
    this.logger = new Logger(this.constructor.name);
  }

  async load() {
    this.model = this.context.model || new this.constructor.model();
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