import { BaseSequencedModel } from './base/sequenced';
import { SequencedEventModel } from './sequenced_event';
import { InstrumentModel } from './instrument';
import { TrackModel } from './track';
import { RouteModel } from './route';
import { RendererModel } from './renderer';
import { PhraseModel } from './phrase';
import { KeySignatureModel } from './key_signature';
import { PatchModel } from './patch';

export class SessionModel extends BaseSequencedModel {

  static properties = {

    events: {
      type: SequencedEventModel,
      collection: true,
    },

    patches: {
      type: PatchModel,
      collection: true,
    },

    instruments: {
      type: InstrumentModel,
      collection: true,
    },

    tracks: {
      type: TrackModel,
      collection: true,
    },

    routes: {
      type: RouteModel,
      collection: true,
    },

    phrases: {
      type: PhraseModel,
      collection: true,
    },

    source: {},

    name: {
      defaultValue: 'Untitled'
    },

    id: {}

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