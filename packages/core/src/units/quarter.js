import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class QuarterUnit extends BaseUnit {
  static definition = DurationValue.get('quarter');
}