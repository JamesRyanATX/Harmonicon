import { BaseModel } from './base';
import { SequencedEventModel } from './sequenced_event';
import { InstrumentModel } from './instrument';
import { TrackModel } from './track';
import { EffectModel } from './effect';
import { RendererModel } from './renderer';
import { PhraseModel } from './phrase';
import { KeySignatureModel } from './key_signature';
import { PatchModel } from './patch';
import { sequenceable } from './mixins/sequenceable';

export class SessionModel extends sequenceable(BaseModel) {

  static properties = {

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