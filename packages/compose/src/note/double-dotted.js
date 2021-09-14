import { doubleDottedEighth } from './eighth';
import { doubleDottedLarge } from './large';
import { doubleDottedLong } from './long';
import { doubleDottedDoubleWhole } from './double-whole';
import { doubleDottedWhole } from './whole';
import { doubleDottedHalf } from './half';
import { doubleDottedQuarter } from './quarter';
import { doubleDottedSixteenth } from './sixteenth';
import { doubleDottedSixtyFourth } from './sixty-fourth';
import { doubleDottedThirtySecond } from './thirty-second';

/**
 * Double dotted notes are 1.75 times the length of the original value.
 * 
 * For example, a double dotted quarter note is a quarter note plus an eighth note plus a sixteenth note.
 * 
 * @class
 * @sort 10
 * @category Notes
 */
export const doubleDotted = {

  /**
   * Double dotted large note value.
   */
  large: doubleDottedLarge,

  /**
   * Double dotted long note value.
   */
  long: doubleDottedLong,

  /**
   * Double dotted double whole note value.
   */
  doubleWhole: doubleDottedDoubleWhole,

  /**
   * Double dotted whole note value.
   */
  whole: doubleDottedWhole,

  /**
   * Double dotted half note value.
   */
  half: doubleDottedHalf,

  /**
   * Double dotted quarter note value.
   */
  quarter: doubleDottedQuarter,

  /**
   * Double dotted eighth note value.
   */
  eighth: doubleDottedEighth,

  /**
   * Double dotted sixteenth note value.
   */
  sixteenth: doubleDottedSixteenth,

  /**
   * Double dotted thirty-second note value.
   */
  thirtySecond: doubleDottedThirtySecond,

  /**
   * Double dotted sixty-fourth note value.
   */
  sixtyFourth: doubleDottedSixtyFourth,

}