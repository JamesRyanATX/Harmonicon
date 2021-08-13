import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class EighthUnit extends BaseUnit {
  static definition = DurationValue.get('eighth');
}
