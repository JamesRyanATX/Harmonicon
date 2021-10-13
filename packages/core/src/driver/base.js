import { Logger } from '@composer/util';

export class BaseDriver {
  get loggerGroup() { return 'Core' };
  get loggerName() { return 'Driver' };

  get name () {
    return this.constructor.name;
  }

  constructor(options = {}) {
    this.options = options;
    this.logger = new Logger(`${this.loggerGroup}.${this.loggerName}`);
  }

}