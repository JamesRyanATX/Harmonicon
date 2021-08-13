import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class ThirtysecondUnit extends BaseUnit {
  static definition = DurationValue.get('thirtysecond');
}
