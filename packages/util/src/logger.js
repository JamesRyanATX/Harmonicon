import chalk from 'chalk';

export class Logger {
  constructor(name) {
    this.name = name;
  }

  error(message) {
    console.error(chalk.red(this.format(message)));
  }

  info(message) {
    console.info(chalk.white.bold(this.format(message)));
  }

  todo(message) {
    console.info(chalk.white.bold(`${this.format(message)} (todo)`));
  }

  hr(length = 80, color = 'white') {
    this.info(chalk.bold[color](''.padEnd(length, '-')));
  }

  header(message) {
    this.info(chalk.yellow.bold(`+${''.padEnd(78, '-')}+`));
    this.info(chalk.yellow.bold(`| ${message.padEnd(76)} |`));
    this.info(chalk.yellow.bold(`+${''.padEnd(78, '-')}+`));
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