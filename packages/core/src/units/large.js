import { BaseUnit } from './base.js';

export class LargeUnit extends BaseUnit {
  static name = 'large';
}

export class DottedLargeUnit extends BaseUnit {
  static name = 'large.';
}

export class DoubleDottedLargeUnit extends BaseUnit {
  static name = 'large..';
}
