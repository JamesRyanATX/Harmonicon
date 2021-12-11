import { mapSeries } from '@composer/util';
import { AudioDriver } from '../../../';

class AudioNode extends AudioDriver.AudioNode {
  connect() {}
}

class Renderer extends AudioDriver.Renderer {

  schedulers = {
    end: () => {},
    key: () => {},
    meter: () => {},
    note: () => {},
    scale: () => {},
    swing: () => {},
    tempo: () => {},
    volume: () => {},
    pan: () => {},

    phrase: async ({
      event,
      trackNode,
      instrumentNode
    }) => {
      const track = trackNode.model;
      const phraseName = event.value;
      const phrase = this.renderer.cache.phrases[phraseName];
      const sequence = phrase.compiled;

      return await mapSeries(sequence, async (step) => {
        const notes = (Array.isArray(step)) ? step : [ step ];

        return await mapSeries(notes, async (note) => {

          // Understood to be a rest
          if (typeof note.pitch === 'undefined') {
            return;
          }

          return this.renderer.scheduleEvent({
            event: event.constructor.parse({
              value: note,
              type: 'note',
              at: event.at.constructor.parse('0:0:0')
            }),
            track,
            trackNode,
            instrumentNode,
          });
        });
      });
    },
  }

  createNode(properties = {}) {
    return AudioNode.parse(properties);
  }

  setPosition() {}
  unscheduleAll() {}
}

class InteractiveRenderer extends Renderer {
}

class BackgroundRenderer extends Renderer {
}

export class Driver extends AudioDriver.Driver {

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

  on() {}

}