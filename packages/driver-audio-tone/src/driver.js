import * as Tone from 'tone';

import { AudioDriver, Harmonicon } from '@composer/core';
import { BackgroundRenderer } from './renderers/background';
import { InteractiveRenderer } from './renderers/interactive';

export class Driver extends AudioDriver.Driver {

  get liveInstruments () {
    return this._liveInstruments = this._liveInstruments || {};
  }

  createInteractiveRenderer ({ session, renderer }) {
    return new InteractiveRenderer({
      driver: this, session, renderer
    });
  }

  createBackgroundRenderer ({ session, renderer }) {
    return new BackgroundRenderer({
      driver: this, session, renderer
    });
  }

  on (eventName, fn) {
    Tone.Transport.on(eventName, fn);
  }

  async playNote({
    note,
    instrument,
    renderer,
    volume = -10
  }) {
    this.liveInstruments[instrument] = (this.liveInstruments[instrument] || await (async () => {
      const device = Harmonicon.getDeviceById(instrument);

      if (device) {
        return device.render();
      }
      else if (renderer) {
        return renderer.getNode('instrument', instrument).node;
      }
      else {
        throw new RendererError(`Unable to locate instrument "${instrument}""`);
      }
    })()).toDestination();

    const notes = (Array.isArray(note) ? note : [ note ]).map((n) => (n.computedPitch()));
    const instrumentNode = this.liveInstruments[instrument];
  
    if (instrumentNode.releaseAll) {
      instrumentNode.releaseAll();
    }

    instrumentNode.set({ volume });
    instrumentNode.triggerAttackRelease((
      notes.length > 1 ? notes : notes[0] 
    ), 1);

    this.logger.debug(`#playNote: notes = ${notes.join(', ')}`);
  }

  async startAudioBuffer() {
    return Tone.start();
  }

};
