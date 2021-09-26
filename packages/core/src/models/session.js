import { BaseModel } from './base.js';
import { SequencedEventModel } from './sequenced_event.js';
import { InstrumentModel } from './instrument.js';
import { TrackModel } from './track.js';
import { EffectModel } from './effect.js';
import { RendererModel } from './renderer.js';
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

  infer({
    instrumentSends = true,
    trackSends = true,
    mainTrack = true,
  } = {}) {
    mainTrack ? this.inferMainTrack() : 1;
    instrumentSends ? this.inferInstrumentSends() : 1;
    trackSends ? this.inferTrackSends() : 1;
  }

  inferMainTrack() {
    // [ 'main', 'main-fx' ].forEach((name) => {
    //   const track = this.tracks.filterByProperty('name', name)[0];

    //   if (!track) {
    //     this.tracks.add(TrackModel.parse({ name, session: this }));
    //   }
    // });

    // this.patches.add(PatchModel.parse({
    //   inputType: 'track',
    //   input: 'main-fx',
    //   outputType: 'track',
    //   output: 'main',
    //   session: this
    // }));

    // this.logger.debug('inferMainTrack')
  }

  inferInstrumentSends() {
    // this.instruments.forEach((instrument) => {
    //   const track = this.tracks.filterByProperty('name', instrument.name)[0];
    //   if (instrument.outputs.length === 0 && track) {

    //     this.patches.add(PatchModel.parse({
    //       inputType: 'instrument',
    //       input: instrument.name,
    //       outputType: 'track',
    //       output: track.name,
    //       session: this
    //     }));
    //   }
    // });
  }

  inferTrackSends() {
    // this.logger.debug('inferTrackSends')

    // this.tracks.forEach((track) => {
    //   if (track.outputs.length === 0) {
    //     this.patches.add(PatchModel.parse({
    //       inputType: 'track',
    //       input: track.name,
    //       outputType: 'track',
    //       output: 'main-fx',
    //       session: this
    //     }));
    //   }
    // });
  }

  async render (driver) {
    this.renderer = this.renderer || RendererModel.parse({
      session: this,
      driver: driver
    })

    await this.renderer.render();

    return this.renderer;
  }

}

SessionModel.init();