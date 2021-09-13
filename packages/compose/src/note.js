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
 * Sequence notes, pitches and and rests.
 * 
 * ### Helpers
 * 
 * As NoteComposer is an abstract class, you should author compositions
 * with the following globally available flavors:
 * 
 * Regular        | Dotted               | Double Dotted
 * ---------------|----------------------|--------------------------
 * `large`        | `dottedLarge`        | `doubleDottedLarge`
 * `long`         | `dottedLong`         | `doubleDottedLong`
 * `doubleWhole`  | `dottedDoubleWhole`  | `doubleDottedDoubleWhole`
 * `whole`        | `dottedWhole`        | `doubleDottedWhole`
 * `half`         | `dottedHalf`         | `doubleDottedHalf`
 * `quarter`      | `dottedQuarter`      | `doubleDottedQuarter`
 * `eighth`       | `dottedEighth`       | `doubleDottedEighth`
 * `sixteenth`    | `dottedSixteenth`    | `doubleDottedSixteenth`
 * `thirtySecond` | `dottedThirtySecond` | `doubleDottedThirtySecond`
 * `sixtyFourth`  | `dottedSixtyFourth`  | `doubleDottedSixtyFourth`
 * 
 * @sort 5
 * @label Note
 * @abstract
 * @class
 * @hideconstructor
 * @category Composers
 */
export class NoteComposer {

  /**
   * Sequence one or more notes at the same position on the timeline.
   *
   * ### Pitch Types
   * 
   * Pitches can be declared in **ABC Notation** or **Relative** to the declared key signature.
   *
   * #### ABC Notation
   * 
   * ```
   * session('my-song', async ({ session }) => {
   *   track('my-track', async ({ track }) => {
   *     track.at(0).play(quarter.note('C'));
   *   })
   * })
   * ```
   *
   * #### Relative Notation
   * 
   * Relative pitches are computed from the key signature.  The benefit of using
   * relative pitches is that, by changing the key signature, a song can be transposed
   * in realtime.
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
   *    ])
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
   * 
   * @param {(Array|Integer|String)} pitch - pitch, chord, or array of pitches
   * @param {Object} options
   * @param {Integer} options.octave - octave (0 to 7)
   * @returns {(NoteModel|NoteModel[])}
   */
  static note(input, options = {}) {
    const duration = this.unit;

    function single(pitch) {
      return NoteModel.parse(
        Object.assign({ duration, pitch }, options)
      );
    }

    function multiple(pitches) {
      return pitches.map((pitch) => {
        return NoteModel.parse(
          Object.assign({ duration, pitch }, options)
        );
      });
    }

    function chord(symbol) {
      return ChordModel.parse(
        Object.assign({ duration, symbol }, options)
      ).toNotes();
    }

    try {
      if (Array.isArray(input)) {
        return multiple(input);
      }
      else if (typeof input === 'string' && input.match(/ /)) {
        return multiple(input.split(/ +/));
      }
      else if (isNote(input)) {
        return single(input);
      }
      else {
        return chord(input);
      }
    }
    catch (e) {
      if (e instanceof ApplicationError) {
        throw new ComposerError(e.message);
      }
    }
  }


  /**
   * Sequence a rest inside a phrase.
   * 
   * @example
   * ``` javascript
   * session.phrase('my-phrase', [
   *   quarter.note('C'),
   *   half.rest(),
   *   quarter.note('D'),
   * ])
   * ```
   * 
   * @param {*} options 
   * @returns {RestModel}
   */
  static rest (options = {}) {
    return RestModel.parse(Object.assign({ duration: this.unit }, options));
  }

  /**
   * @hideconstructor
   * @ignore
   */
  constructor () { }
}
