import { ExpressionModel, PhraseModel } from '@composer/core';
import { BaseComposer } from './base';


/**
 * Create reusable phrases with {@link SessionComposer#phrase|session.phrase()}:
 * 
 * ``` javascript
 * session.phrase('progression', ({ phrase }) => {
 *   phrase.sequence([
 *     whole.note('cmaj'),
 *     whole.note('fmaj'),
 *     whole.note('cmaj'),
 *     whole.note('gmaj'),
 *   ])
 * });
 * 
 * // Play progression on piano:
 * session.track('piano', ({ track }) => {
 *   track.at(0).play.phrase('progression');
 * });
 * 
 * // Play progression on acoustic guitar:
 * session.track('acoustic-guitar', ({ track }) => {
 *   track.at(0).play.phrase('progression');
 * });
 * ``` 
 * 
 * Phrases are declared once, but can be used by any track any number
 * of times and are agnostic of the instrument playing them.  Meaning,
 * if 3 instruments play the same melody, you only have to code it once.
 * 
 * ### Shorthand
 * 
 * The same phrase can also be written more tersely:
 * 
 * ``` javascript
 * session.phrase('progression', [
 *   whole.note('cmaj'),
 *   whole.note('fmaj'),
 *   whole.note('cmaj'),
 *   whole.note('gmaj'),
 * ]);
 * ```
 * 
 * ### Anonymous Phrases
 * 
 * Phrases can also be sequenced without being declared previously:
 * 
 * ``` javascript
 * session.track('piano', ({ track }) => {
 *   track.at(0).play.phrase([
 *     whole.note('cmaj'),
 *     whole.note('fmaj'),
 *     whole.note('cmaj'),
 *     whole.note('gmaj'),
 *   ]);
 * });
 * ```
 * 
 * Anonymous phrases are not reusable, but they can make sequencing easier.
 * 
 * @sort 5
 * @label Phrases
 * @category Composers
 * @hideconstructor
 */
export class PhraseComposer extends BaseComposer {
  static composerContextName = 'phrase';
  static model = PhraseModel;

  /**
   * Assign a sequence of notes to a phrase.
   * 
   * @example
   * phrase('melody', ({ phrase }) => {
   *   phrase.sequence([
   *     quarter.note(0),
   *     quarter.note(4),
   *     quarter.note(2),
   *     quarter.note(3),
   *   ])
   * })
   * 
   * @example
   * phrase('melody', ({ phrase }) => {
   *   phrase.sequence(expression(...))
   * })
   * 
   * @param {Array|ExpressionModel} sequence - Sequence of notes and rests
   */
  sequence(sequence) {
    this.model.properties.sequence = (() => {
      if (sequence instanceof ExpressionModel) {
        return sequence;
      }
      else {
        return ExpressionModel.coerce(
          Array.isArray(sequence) ? sequence : [ ...arguments ]
        );
      }
    })();
  }
}

export const phrase = PhraseComposer.composer();