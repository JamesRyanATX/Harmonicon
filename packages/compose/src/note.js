import {
  ApplicationError,
  ChordModel,
  NoteModel,
  RestModel,
} from "@composer/core";

import { ComposerError } from "./errors";

function isNote (pitch) {
  return (
    typeof pitch === 'number' ||
    (
      typeof pitch === 'string' &&
      pitch.match(/^[abcdefg][b\#]{0,1}[0-9]{0,1}$/i)
    )
  );
}

/**
 * Sequence single notes, chords and rests with note factories.
 * 
 * The following example uses {@link quarter}, {@link eighth} and {@link dotted.quarter} note factories:
 * 
 * ``` javascript
 * // Single note:
 * track.at(0).play(quarter.note('C5'))
 * 
 * // Named chord:
 * track.at(0).play(quarter.note('Cmaj7'))
 *
 * // Custom chord:
 * track.at(0).play(quarter.note('C4 D4 E4 G5'))
 * 
 * // One bar phrase with chords and a rest:
 * track.at(0).play.phrase([
 *   dotted.quarter.note('Cmaj7'),
 *   eighth.note('Dmin'),
 *   quarter.rest(),
 *   quarter.note('Bmaj')
 * ]);
 * ```
 * 
 * ### Note Factories
 * 
 * Note factories are subclasses of {@link NoteComposer} bound to a specific time unit.
 * 
 * **Standard**<br>
 * {@link large}
 * {@link long}
 * {@link doubleWhole}
 * {@link whole}
 * {@link half}
 * {@link quarter}
 * {@link eighth}
 * {@link sixteenth}
 * {@link thirtySecond}
 * {@link sixtyFourth}
 * 
 * **Dotted**<br>
 * {@link dotted.large}
 * {@link dotted.long}
 * {@link dotted.doubleWhole}
 * {@link dotted.whole}
 * {@link dotted.half}
 * {@link dotted.quarter}
 * {@link dotted.eighth}
 * {@link dotted.sixteenth}
 * {@link dotted.thirtySecond}
 * {@link dotted.sixtyFourth}
 * 
 * **Double Dotted**<br>
 * {@link doubleDotted.large}
 * {@link doubleDotted.long}
 * {@link doubleDotted.doubleWhole}
 * {@link doubleDotted.whole}
 * {@link doubleDotted.half}
 * {@link doubleDotted.quarter}
 * {@link doubleDotted.eighth}
 * {@link doubleDotted.sixteenth}
 * {@link doubleDotted.thirtySecond}
 * {@link doubleDotted.sixtyFourth}
 * 
 * **Triplets**<br>
 * {@link triplet.quarter}
 * {@link triplet.eighth}
 * {@link triplet.sixteenth}
 * 
 * **Quintuplets**<br>
 * {@link quintuplet.quarter}
 * {@link quintuplet.eighth}
 * {@link quintuplet.sixteenth}
 * 
 * **Septuplets**<br>
 * {@link septuplet.quarter}
 * {@link septuplet.eighth}
 * {@link septuplet.sixteenth}
 * 
 * ### Pitches
 * 
 * Pitches are specified in {@link https://en.wikipedia.org/wiki/ABC_notation|ABC Notation} or as integers relative to the key signature.
 *
 * #### ABC Notation
 * 
 * ```
 * // Default octave (4)
 * track.at(0).play(quarter.note('C'));
 * 
 * // With specific octave:
 * track.at(0).play(quarter.note('C2'));
 * ```
 *
 * #### Relative Notation
 * 
 * Relative pitches are signed integers that will be transposed to notes in the appropriate key signature at the time they are played.
 * 
 * Consider the following:
 * 
 * ```
 * session('my-song', async ({ session }) => {
 *   session.at(0)
 *     .key('C')
 *     .scale('major');
 * 
 *   session.phrase('melody', [
 *     quarter.note(0),
 *     quarter.note(1),
 *     quarter.note(2),
 *     quarter.note(3),
 *   ])
 * 
 *   track('my-track', async ({ track }) => {
 *     track.at(0).play.phrase('melody'); // ==> C4, D4, E4, F4
 *     track.at(2).play.phrase('melody'); // ==> C4, D4, E4, F4
 *   });
 * });
 * ```
 * 
 * If we change the key signature at measure 2, the resulting notes are:
 * 
 * ```
 * session('my-song', async ({ session }) => {
 *   session.at(0)
 *     .key('C')
 *     .scale('major');
 * 
 *   session.at(2)
 *     .key('E')
 *     .scale('major');
 * 
 *   session.phrase('melody', [
 *     quarter.note(0),
 *     quarter.note(1),
 *     quarter.note(2),
 *     quarter.note(3),
 *    ])
 * 
 *   track('my-track', async ({ track }) => {
 *     track.at(0).play.phrase('melody'); // ==> C4, D4, E4, F4
 *     track.at(2).play.phrase('melody'); // ==> E4, F#, G#, A4
 *   });
 * });
 * ```
 * 
 * ### Chords
 * 
 * #### Named Chords
 *
 * Harmonicon supports a large number of chords that can be referenced by name:
 * 
 * ``` javascript
 * session.track('my-track', async () => {
 *  track.at(0).play(quarter.note('cmaj7'))
 * })
 * ```
 * 
 * #### Custom Chord Structures
 * 
 * To specify chord notes manually, provide an array of notes:
 * 
 * ``` javascript
 * session.track('my-track', async () => {
 *  track.at(0).play(quarter.note([ 'C4', 'E4', 'F4' ]));
 * })
 * ```
 *
 * Alternatively, a space-delimited string also works:
 * 
 * ``` javascript
 * session.track('my-track', async () => {
 *  track.at(0).play(quarter.note('C4 E4 F4');
 * })
 * ```
 * 
 * @abstract
 * @hideconstructor
 * @sort 4
 * @label Notes
 * @category Composers
 */
export class NoteComposer {

  static inferParser(value) {

    // Array of notes
    if (Array.isArray(value)) {
      return { value, parser: 'unnamedChord' };
    }

    value = String(value);

    // Multiple space-delimited notes
    if (value.match(/ /)) {
      return {
        value: value.split(/ /),
        parser: 'unnamedChord' 
      };
    }

    // Explicit chord (beginning with "*")
    else if (value.match(/^\*/)) {
      return { 
        value: value.replace(/^\*/, ''),
        parser: 'namedChord'
      };
    }

    // Relative note
    else if (value.match(/^\-{0,1}[0-9]+$/)) {
      return { value, parser: 'note' };
    }

    // Absolute (ABC notation) note
    else if (value.match(/^[abcdefg][b\#]{0,1}[0-9]{0,1}$/i)) {
      return { value, parser: 'note' };
    }

    // Assume a chord of some kind...
    else {
      return { value, parser: 'namedChord' };
    }
  }

  /**
   * Sequence one or more pitches at a position on the timeline.
   *
   * @param {(Array|Integer|String)} pitch - pitch, chord, or array of pitches
   * @param {Object} options
   * @param {Integer} options.octave - octave (0 to 7)
   * @returns {(NoteModel|NoteModel[])}
   */
  static note(input, options = {}) {
    const duration = this.unit;
    const parsers = {};

    parsers.note = (pitch) => {
      return NoteModel.parse(
        Object.assign({ duration, pitch }, options)
      );
    }

    parsers.unnamedChord = (pitches) => {
      return pitches.map((pitch) => {
        return NoteModel.parse(
          Object.assign({ duration, pitch }, options)
        );
      });
    }

    parsers.namedChord = (symbol) => {
      return ChordModel.parse(
        Object.assign({ duration, symbol }, options)
      ).toNotes();
    }

    try {
      const { parser, value } = this.inferParser(input);

      if (parsers[parser]) {
        return parsers[parser](value);
      }
      else {
        throw new ComposerError(`Unable to parse ${input}`);
      }
    }
    catch (e) {
      if (e instanceof ApplicationError) {
        throw new ComposerError(e.message);
      }
      else {
        throw e;
      }
    }
  }


  /**
   * Sequence a rest inside a phrase.
   * 
   * @example
   * // One bar phrase with a 2 beat rest:
   * session.phrase('my-phrase', [
   *   quarter.note('C'),
   *   half.rest(),
   *   quarter.note('D'),
   * ])
   * 
   * @param {*} options 
   * @returns {RestModel}
   */
  static rest (options = {}) {
    return RestModel.parse(Object.assign({ duration: this.unit }, options));
  }

}
