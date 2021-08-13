export class BaseUnit {
  static definition = {};

  static toDecimal() {
    return Number(this.definition.value);
  }

  static toString() {
    return JSON.stringify(this.definition);
  }
}