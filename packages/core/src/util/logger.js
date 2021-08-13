export class Logger {
  constructor(name) {
    this.name = name;
  }

  debug(message) {
    console.log(`${this.name}: ${message}`);
  }
}