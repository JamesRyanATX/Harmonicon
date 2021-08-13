import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class WholeUnit extends BaseUnit {
  static definition = DurationValue.get('whole');
}
