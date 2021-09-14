import { PhraseModel } from '@composer/core';
import { BaseComposer } from './base';


/**
 * Create reusable phrases with {@link SessionComposer#phrase|session.phrase()}:
 * 
 * ```
 * session.phrase('progression', async ({ phrase }) => {
 *   phrase.steps([
 *     whole.note('cmaj'),
 *     whole.note('fmaj'),
 *     whole.note('cmaj'),
 *     whole.note('gmaj'),
 *   ])
 * });
 * 
 * // Play progression on piano:
 * session.track('piano', async ({ track }) => {
 *   track.at(0).play.phrase('progression');
 * });
 * 
 * // Play progression on acoustic guitar:
 * session.track('acoustic-guitar', async ({ track }) => {
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
 * session.track('piano', async ({ track }) => {
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
   * Assign steps to a phrase.
   * 
   * @example
   * phrase('melody', ({ phrase }) => {
   *   phrase.steps([
   *     quarter.note(0),
   *     quarter.note(4),
   *     quarter.note(2),
   *     quarter.note(3),
   *   ])
   * })
   * 
   * @param {Array} steps - Sequence of notes and rests
   */
  steps(steps = []) {
    this.model.properties.steps = Array.isArray(steps) ? steps : [ ...arguments ];
  }
}

export const phrase = PhraseComposer.composer();