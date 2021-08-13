import { BaseModel } from './base';
import { SequencedEventModel } from './sequenced_event';
import { InstrumentModel } from './instrument';
import { TrackModel } from './track';
import { RouteModel } from './route';
import { RendererModel } from './renderer';
import { PhraseModel } from './phrase';

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


    // Session name
    name: {
      defaultValue: 'Untitled'
    }

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