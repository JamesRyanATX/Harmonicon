export class BaseUnit {
  static definition = {};

  static toBeats(timeSignature = [ 4, 4 ]) {
    return this.toDecimal() * timeSignature[1];
  }

  static toDecimal() {
    return Number(this.definition.value);
  }

  static toString() {
    return JSON.stringify(this.definition);
  }
}