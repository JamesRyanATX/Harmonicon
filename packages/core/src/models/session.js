import { BaseModel } from './base.js';
import { SequencedEventModel } from './sequenced_event.js';
import { InstrumentModel } from './instrument.js';
import { TrackModel } from './track.js';
import { EffectModel } from './effect.js';
import { InteractiveRendererModel, BackgroundRendererModel } from './renderer.js';
import { PhraseModel } from './phrase.js';
import { AnnotationModel } from './annotation.js';
import { KeySignatureModel } from './key_signature.js';
import { PatchModel } from './patch.js';
import { PositionModel } from './position';
import { sequenceable } from './mixins/sequenceable.js';

export class SessionModel extends sequenceable(BaseModel) {

  static properties = {

    annotations: {
      type: AnnotationModel,
      collection: true,
    },

    effects: {
      type: EffectModel,
      collection: true,
    },

    events: {
      type: SequencedEventModel,
      collection: true,
    },

    id: {
      type: String,
    },

    instruments: {
      type: InstrumentModel,
      collection: true,
    },

    name: {
      defaultValue: 'Untitled'
    },

    patches: {
      type: PatchModel,
      collection: true,
    },

    phrases: {
      type: PhraseModel,
      collection: true,
    },

    source: {
      type: String,
    },

    tracks: {
      type: TrackModel,
      collection: true,
    },

  }

  /**
   * Get an background renderer (non-interactive)
   */
  get backgroundRenderer () {
    return this._backgroundRenderer = (this._backgroundRenderer || BackgroundRendererModel.parse({
      session: this
    }))
  }

  /**
   * Get an interactive renderer (plays output, can be controlled)
   */
  get interactiveRenderer () {
    return this._interactiveRenderer = (this._interactiveRenderer || InteractiveRendererModel.parse({
      session: this
    }))
  }


  parsePosition(annotationOrPosition) {
    const annotation = typeof annotationOrPosition === 'string'
      ? this.annotations.filterByProperty('name', annotationOrPosition)[0]
      : null;

    if (annotation) {
      return annotation.position;
    }
    else {
      return PositionModel.parse.apply(PositionModel, arguments);
    }
  }

  keySignatureAt(position) {
    const keyEvent = this.getLastEventByTypeAndPosition('key', position);
    const scaleEvent = this.getLastEventByTypeAndPosition('scale', position);

    return KeySignatureModel.parse({
      tonic: `${keyEvent ? keyEvent.value : 'c'}4`,
      mode: scaleEvent ? scaleEvent.value : 'major'
    });
  }

  meterAt(position) {
    const event = this.getLastEventByTypeAndPosition('meter', position);
    const meter = event ? event.value : [ 4, 4 ];

    return meter;
  }

  tempoAt(position) {
    const event = this.getLastEventByTypeAndPosition('tempo', position);
    const meter = event ? event.value : 120;

    return meter;
  }

  /**
   * Compute the elapsed time from 0 to a given position on the timeline
   * 
   * @todo support beats and subdivision
   * @param {PositionModel} position - position on timeline
   * @returns {number}
   */
  elapsedTimeAtPosition(position) {
    const lastMeasure = position.measure;

    let tempo = null;
    let meter = null;
    let measureLength = null;
    let currentMeasure = 0;
    let currentPosition = PositionModel.parse(0);
    let totalLength = 0;

    while (currentMeasure < lastMeasure) {
      meter = this.meterAt(currentPosition);
      tempo = this.tempoAt(currentPosition);
      measureLength = (60 / tempo) * meter[1];

      // console.log(`currentMeasure = ${currentMeasure} meter = ${meter}; tempo = ${tempo}; measureLength = ${measureLength}s; totalLength = ${totalLength}`);

      totalLength += measureLength;

      currentMeasure += 1;
      currentPosition = PositionModel.parse(currentMeasure);
    }

    return Math.round(totalLength * 1000) / 1000;
  }

  /**
   * Render session to audio nodes.
   * 
   * @param {object} options - rendering options
   * @param {object} options.interactive - whether or not the renderer should be interactive (start/stop/play/pause)
   * @param {object} options.duration - amount of time to render (non-interactive only)
   * @returns 
   */
  async render ({
    interactive = true,
    duration = null,
    sampleRate = null,
  } = {}) {
    return (interactive ? this.interactiveRenderer : this.backgroundRenderer).render({
      duration, sampleRate
    });
  }

}

SessionModel.init();