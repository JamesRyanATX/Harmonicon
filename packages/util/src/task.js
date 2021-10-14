import { Model } from './model';
import { Logger } from './logger';

/**
 * Wrap an async function with an evented task model with a
 * progress callback.
 * 
 * @param {function} fn - 
 */
export class Task extends Model {
  get loggerGroup() { return 'Util'; }
  get loggerName() { return 'Task'; }

  static properties = {
    fn: {}
  }

  constructor(fn) {
    super({ fn });

    this.logger = new Logger(`${this.loggerGroup}.${this.loggerName}`);

    this.allow('run');
    this.allow('progress');
    this.allow('success');
    this.allow('error');
    this.allow('done');

    this.on('success', this.done.bind(this));
    this.on('error', this.done.bind(this));
  }

  succeed(results) {
    this.emit('success', results);
    this.accept(results);
  }

  fail(error) {
    this.emit('error', error);
    this.reject(error);
  }

  done() {
    this.emit('done');
  }

  progress(amount) {
    this.emit('progress', amount);
  }

  async run() {
    return await new Promise((accept, reject) => {
      this.emit('run');

      this.accept = accept;
      this.reject = reject;

      this.fn(this)
        .then(this.succeed.bind(this))
        .catch(this.fail.bind(this));
    });
  }

}

Task.init();