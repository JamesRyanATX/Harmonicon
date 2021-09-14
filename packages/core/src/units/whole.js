import { BaseUnit } from './base.js';

export class WholeUnit extends BaseUnit {
  static name = 'whole';
}

export class DottedWholeUnit extends BaseUnit {
  static name = 'whole.';
}

export class DoubleDottedWholeUnit extends BaseUnit {
  static name = 'whole..';
}
