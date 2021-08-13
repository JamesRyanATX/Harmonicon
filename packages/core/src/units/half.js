import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class HalfUnit extends BaseUnit {
  static definition = DurationValue.get('half');
}
