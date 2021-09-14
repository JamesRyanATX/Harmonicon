import { dottedEighth } from './eighth';
import { dottedLarge } from './large';
import { dottedLong } from './long';
import { dottedDoubleWhole } from './double-whole';
import { dottedWhole } from './whole';
import { dottedHalf } from './half';
import { dottedQuarter } from './quarter';
import { dottedSixteenth } from './sixteenth';
import { dottedSixtyFourth } from './sixty-fourth';
import { dottedThirtySecond } from './thirty-second';

/**
 * Dotted notes are 1.5 times the length of the original value.
 * 
 * For example, a dotted quarter note is a quarter note plus an eighth note.
 * 
 * @class
 * @sort 10
 * @category Notes
 */
export const dotted = {

  /**
   * Dotted large note value.
   */
  large: dottedLarge,

  /**
   * Dotted long note value.
   */
  long: dottedLong,

  /**
   * Dotted double whole note value.
   */
  doubleWhole: dottedDoubleWhole,

  /**
   * Dotted whole note value.
   */
  whole: dottedWhole,

  /**
   * Dotted half note value.
   */
  half: dottedHalf,

  /**
   * Dotted quarter note value.
   */
  quarter: dottedQuarter,

  /**
   * Dotted eighth note value.
   */
  eighth: dottedEighth,

  /**
   * Dotted sixteenth note value.
   */
  sixteenth: dottedSixteenth,

  /**
   * Dotted thirty-second note value.
   */
  thirtySecond: dottedThirtySecond,

  /**
   * Dotted sixty-fourth note value.
   */
  sixtyFourth: dottedSixtyFourth,

}