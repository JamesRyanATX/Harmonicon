import { Harmonicon, AudioNodeModel, RendererError } from '@composer/core';
import { BaseAudioDriver } from '@composer/driver';
import { mapSeries } from '@composer/util';
import * as Tone from 'tone';


export class ToneAudioDriverNode extends AudioNodeModel {

  get loaded() {
    return this.node.loaded !== false;
  }

  static parse(properties) {

    // Create a Channel if a node was not provided
    if (!properties.node) {
      properties.node = new Tone.Channel({ channelCount: 2, solo: false, mute: false });
    }

    // Connect root node to direct output
    if (properties.root) {
      properties.node.toDestination();
    }

    return new this(properties);
  }

  connect(to) {
    this.node.connect(to.node);
  }
};

class ToneAudioBaseDriver extends BaseAudioDriver {

  schedulers = {

    // End the composition (trigger transport stop)
    end: async ({ event }) => {
      this.logger.info(`render.session.event.end: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.end:     value = ${event.value}`);

      return await this.transport.schedule(() => {
        this.transport.stop();
      }, event.at.toMBS());
    },

    // Set meter (time signature formatted as [ a, b ])
    meter: async ({ event }) => {
      this.logger.info(`render.session.event.meter: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.meter:     meter = ${event.value}`);

      return await this.transport.schedule(() => {
        this.transport.set({
          timeSignature: event.value,
        });
      }, event.at.toString());
    },

    // Set tempo (in bpm)
    tempo: async ({ event }) => {
      this.logger.info(`render.session.event.tempo: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.tempo:     tempo = ${event.value}`);

      return await this.transport.schedule(() => {
        this.transport.set({
          bpm: event.value,
        });
      }, event.at.toString());
    },

    // Set swing constant (0 to 1)
    swing: async ({ event }) => {
      this.logger.info(`render.session.event.swing: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.swing:     swing = ${event.value}`);
    
      return await this.transport.schedule(() => {
        this.transport.set({
          swing: event.value,
        });
      }, event.at.toString());
    },

    // Set key (root note)
    key: async ({ event }) => {
      this.logger.debug(`render.session.event.key: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.key:     key = ${event.value}`);

      return await this.transport.schedule(() => {
        this.transport._key = event.value;
      }, event.at.toString());
    },

    // Set scale/mode (?)
    scale: async ({ event }) => {
      this.logger.debug(`render.session.event.scale: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.scale:     scale = ${event.value}`);

      return await this.transport.schedule(() => {
        this.transport._scale = event.value;
      }, event.at.toString());
    },

    // Set volume (0 to 1)
    volume: async ({ event, audioNode, instrumentNode }) => {
      return await this.transport.schedule(() => {
        audioNode.node.set({ volume: event.value });
      }, event.at.toString());
    },

    // Set pan (-1 to 1)
    pan: async ({ event, audioNode }) => {
      return await this.transport.schedule(() => {
        audioNode.node.set({ pan: event.value });
      }, event.at.toString());
    },

    // Mute an audio node
    mute: async ({ event, audioNode }) => {
      return await this.transport.schedule(() => {
        audioNode.node.set({ mute: event.value });
      }, event.at.toString());
    },

    // // Solo an audio node
    // solo: async ({ event, audioNode, instrumentNode }) => {
    //   this.logger.debug(`render.session.event.solo: [+] at = ${event.at}`);
    //   this.logger.debug(`render.session.event.solo:     solo = ${event.value}`);

    //   return await this.transport.schedule(() => {
    //     console.log(`solo = ${event.value}`)
    //     audioNode.node.solo = true;//set({ solo: event.value });
    //     audioNode.node.toDestination();
    //   }, event.at.toString());
    // },
    
    // Play a sequence of notes (phrase)
    phrase: async ({
      event,
      trackNode,
      instrumentNode
    }) => {
      const track = trackNode.model;
      const phraseName = event.value;
      const phrase = this.renderer.cache.phrases[phraseName];
      const steps = phrase.steps;
      
      let position = Tone.Time(event.at.toString());

      // this.logger.info(`render.session.event.phrase: [+] at = ${event.at}`);
      // this.logger.debug(`render.session.event.phrase:   phrase = ${phraseName}`);
      // this.logger.debug(`render.session.event.phrase:   number of steps = ${phrase.steps.length}`);
      // this.logger.debug(`render.session.event.phrase:   position = ${position.toBarsBeatsSixteenths()}`);
      // this.logger.debug(`render.session.event.phrase:   instrument = ${instrument}`);

      await this.transport.set({
        position: position.toBarsBeatsSixteenths()
      });

      return await mapSeries(steps, async (step) => {
        const notes = (Array.isArray(step)) ? step : [ step ];

        await mapSeries(notes, async (note) => {

          // Understood to be a rest
          if (typeof note.pitch === 'undefined') {
            return;
          }

          return this.renderer.scheduleEvent({
            event: event.constructor.parse({
              value: note,
              type: 'note',
              at: event.at.constructor.parse(this.transport.position.toString())
            }),
            trackNode,
            instrumentNode,
          });

        });

        return await this.transport.set({
          position: `+${notes[0].duration.toMBS(track.meterAt(event.at))}`,
        });
      });
    },

    // Play a single note
    note: async ({ event, trackNode, instrumentNode }) => {
      const track = trackNode.model;
      const instrument = instrumentNode.model;

      const note = event.value;
      const keySignature = track.keySignatureAt(event.at);
      const meter = track.meterAt(event.at);
      const pitch = instrument.pitchAliases[note.pitch] || note.computedPitch(keySignature);
      const duration = note.duration.toMBS(meter);

      // this.logger.info(`render.session.event.note: [+] position = ${event.at}`);
      // this.logger.debug(`render.session.event.note:     pitch = ${note.pitch} => ${pitch}`);
      // this.logger.debug(`render.session.event.note:     duration = ${duration}`);
      // this.logger.debug(`render.session.event.note:     key signature = ${keySignature}`);
      // this.logger.debug(`render.session.event.note:     instrument = ${instrument}`);

      return this.transport.schedule((time) => {
        if (instrumentNode.node.triggerAttackRelease.length === 2) {
          instrumentNode.node.triggerAttackRelease(duration, time);
        }
        else {
          instrumentNode.node.triggerAttackRelease(pitch, duration, time);
        }

        Tone.Draw.schedule(() => {
          Harmonicon.emit(`play:${pitch.toLowerCase()}`);
        }, time);
      }, event.at.toString());
    }
  }

  get liveInstruments () {
    return this._liveInstruments = this._liveInstruments || {};
  }

  get state () {
    return this.transport.state; // started|stopped
  }

  get position () {
    const ticks = this.transport.ticks
    const parts = this.transport.position.split(':');
    const measure = Number(parts[0]);
    const beat = Number(parts[1]);
    const subdivision = Number(parts[2]);
    const realtime = (Math.round(this.transport.seconds * 100) / 100).toFixed(2);
    const tempo = this.transport.bpm.value;
    const swing = this.transport.swing.value;
    const timeSignature = this.transport.timeSignature;
    const meter = timeSignature;

    const key = this.transport._key;
    const scale = this.transport._scale;

    return { 
      beat,
      key,
      measure,
      meter,
      realtime,
      scale,
      subdivision,
      swing,
      tempo,
      ticks,
    }
  }

  // Remove all events from timeline
  async unscheduleAll() {
    return this.transport.cancel(0);
  }

  // Pause transport at current position
  async pause() {
    return this.transport.pause();
  }

  // Stop transport and go back to 0:0:0
  async stop() {
    await this.transport.stop();
  }

  // Play transport from current position
  async play() {
    if (Tone.context.state === 'suspended') {
      await Tone.start();
    }

    return this.transport.start();
  }

  async export() {
    return Tone.Offline(({ transport }) => {
      const driver = new ToneAudioOfflineDriver(Object.assign({
        transport
      }, this.options));

      debugger;
    }, 2);
  }

  async playNote({
    note,
    instrument,
    volume = -10
  }) {
    this.liveInstruments[instrument] = (this.liveInstruments[instrument] || await (async () => {
      const device = Harmonicon.getDeviceById(instrument);

      if (device) {
        return device.render();
      }
      else if (this.renderer) {
        return this.renderer.getNode('instrument', instrument).node;
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

  on (eventName, fn) {
    this.transport.on(eventName, fn);
  }

  observePosition(fn) {
    this.transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        fn(this.position);
      }, time);
    }, '8n', 0);
  }

  createNode(properties = {}) {
    return ToneAudioDriverNode.parse(properties);
  }

  async setTransportPosition (position) {
    return this.transport.set({ position })
  }

  async startAudioBuffer() {
    return Tone.start();
  }
}

export class ToneAudioOfflineDriver extends ToneAudioBaseDriver {

  get transport() {
    return this.options.transport;
  }

}


export class ToneAudioDriver extends ToneAudioBaseDriver {

  get transport() {
    return Tone.Transport;
  }

}

