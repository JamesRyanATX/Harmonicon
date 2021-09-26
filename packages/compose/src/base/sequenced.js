import { PositionModel, SequencedEventModel, InvalidPositionError } from '@composer/core';
import { BaseComposer } from '../base';
import { ComposerError } from '../errors';

/**
 * Base composer class for models that can be sequenced.
 * 
 * @ignore
 */
export class BaseSequencedComposer extends BaseComposer {
  static sequencerProxy = null;

  constructor(name, fn, context) {
    super(name, fn, context);
  }

  /**
   * Select a position on the timeline by measure, beat and subdivision.
   * 
   * Positions begin from **0**, meaning that "measure 1, beat 1" in
   * spoken word implies "measure 0, beat 0" in Harmonicon.
   * 
   * ##### Examples
   * 
   * Set tempo to 120 at the beginning of song:
   * 
   * ``` javascript
   * session('my-song', ({ session }) => {
   *   session.at(0).tempo(120);
   * })
   * ```
   * 
   * Play a C# on beat 2 of measure 1:
   * 
   * ``` javascript
   * track('my-song', ({ session }) => {
   *   track.at(1, 2).play(quarter.note('C#'));
   * })
   * ```
   * 
   * Trigger multiple actions at the same position:
   * 
   * ``` javascript
   * track('my-song', ({ session }) => {
   *   session.at(0)
   *     .meter([ 4, 4 ])
   *     .tempo(120)
   *     .key('C')
   * })
   * ```
   * 
   * @sort 100
   * @param {Number} measure - Measure number starting from zero
   * @param {Number} beat - Beat number starting from zero
   * @param {Number} subdivision - Subdivision (between 0 and 1)
   * @returns {Proxy}
   */
  at() {
    try {
      return new this.constructor.sequencerProxy(this, {
        at: this.parsePosition.apply(this, arguments)
      });  
    }
    catch (e) {
      if (e instanceof InvalidPositionError) {
        throw new ComposerError(e.message);
      }
      else {
        throw e;
      }
    }
  }

  parsePosition () {
    if (this.model.parsePosition) {
      return this.model.parsePosition.apply(this.model, arguments);
    }
    else {
      return PositionModel.parse.apply(PositionModel, arguments);
    }
  }

  sequence(event) {
    this.model.events.add(SequencedEventModel.parse(event));
  }
}
