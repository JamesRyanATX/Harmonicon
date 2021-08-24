export class BaseUnit {
  static definition = {};

  static toMBS(meter = [ 4, 4 ]) {
    const asBeats = this.toBeats(meter);
    const beatsPerMeasure = meter[0];
    const measures = Math.floor(asBeats / beatsPerMeasure);
    const beats = asBeats % beatsPerMeasure;
    const subdivisions = 0;

    return `${measures}:${beats}:${subdivisions}`;
  }

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