import chalk from 'chalk';

export class Logger {
  static console = console;

  get console () {
    return this.constructor.console;
  }

  constructor(name) {
    this.name = name;
  }

  error(message) {
    this.console.error(chalk.red(this.format(message)));
  }

  info(message) {
    this.console.info(chalk.white.bold(this.format(message)));
  }

  todo(message) {
    this.console.info(chalk.white.bold(`${this.format(message)} (todo)`));
  }

  debug(message) {
    this.console.debug(this.format(message));
  }

  log(message) {
    this.console.log(this.format(message));
  }

  hr(length = 80, color = 'white') {
    this.info(chalk.bold[color](''.padEnd(length, '-')));
  }

  header(message) {
    this.info(chalk.yellow.bold(`+${''.padEnd(78, '-')}+`));
    this.info(chalk.yellow.bold(`| ${message.padEnd(76)} |`));
    this.info(chalk.yellow.bold(`+${''.padEnd(78, '-')}+`));
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