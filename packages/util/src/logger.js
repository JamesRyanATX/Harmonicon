import chalk from 'chalk';

export class Logger {
  constructor(name) {
    this.name = name;
  }

  error(message) {
    console.error(chalk.red(this.format(message)));
  }

  debug(message) {
    console.log(this.format(message));
  }

  log(message) {
    console.log(this.format(message));
  }

  format(message) {
    message = (() => {
      if (typeof message === 'string') {
        return message;
      }
      else if (typeof message !== 'object') {
        return message;
      }
      else {
        return JSON.stringify(message, null, 2);
      }
    })();

    if (this.name) {
      return `${this.name}: ${message}`;
    }
    else {
      return message;
    }
  }
}