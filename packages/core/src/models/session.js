import { BaseModel } from './base';
import { SequencedEventModel } from './sequenced_event';
import { InstrumentModel } from './instrument';
import { TrackModel } from './track';
import { RouteModel } from './route';
import { RendererModel } from './renderer';
import { PhraseModel } from './phrase';
import { KeySignatureModel } from './key_signature';

export class SessionModel extends BaseModel {

  static properties = {

    events: {
      type: SequencedEventModel,
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

    name: {
      defaultValue: 'Untitled'
    }

  }

  getLastEventByTypeAndPosition(type, position) {
    return this.events.all
      .filter((event) => {
        return (
          event.type === type &&
          event.at.measure <= position.measure &&
          event.at.beat <= position.beat &&
          event.at.subdivision <= position.subdivision
        );
      })
      .sort((a, b) => {
        return (
          a.measure < b.measure &&
          a.beat < b.beat &&
          a.subdivision < b.subdivision
        ) ? -1 : 1
      })[0];
  }

  keySignatureAt(position) {
    const keyEvent = this.getLastEventByTypeAndPosition('key', position);
    const scaleEvent = this.getLastEventByTypeAndPosition('scale', position);

    return KeySignatureModel.parse({
      tonic: `${keyEvent ? keyEvent.value : 'c'}4`,
      mode: scaleEvent ? scaleEvent.value : 'major'
    });
  }

  async render (driver) {
    this.renderer = this.renderer || RendererModel.parse({
      session: this,
      driver: new driver()
    })

    await this.renderer.render();

    return this.renderer;
  }

}

SessionModel.init();