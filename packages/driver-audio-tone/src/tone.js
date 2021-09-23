import { Harmonicon } from '@composer/core';
import { BaseAudioDriver } from '@composer/driver';
import { mapSeries } from '@composer/util';
import * as Tone from 'tone';

export class ToneAudioDriverNode {

  get name() {
    return this.properties.name;
  }

  get root() {
    return !!this.properties.root;
  }

  get loaded() {
    return this.node.loaded !== false;
  }

  constructor(properties) {
    this.properties = properties;
    this.node = properties.node || new Tone.Channel();

    // Connect root node to direct output
    if (this.root) {
      this.node.toDestination();
    }
  }

  connect(to) {
    this.node.connect(to.node);
  }

  toString() {
    return `${this.name}${this.root ? ' (root)' : ''}`;
  }
};

export class ToneAudioDriver extends BaseAudioDriver {

  schedulers = {

    // End the composition (trigger transport stop)
    end: async ({ event }) => {
      this.logger.info(`render.session.event.end: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.end:     value = ${event.value}`);

      return await Tone.Transport.schedule(() => {
        Tone.Transport.stop();
      }, event.at.toMBS());
    },

    // Set meter (time signature formatted as [ a, b ])
    meter: async ({ event }) => {
      this.logger.info(`render.session.event.meter: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.meter:     meter = ${event.value}`);

      return await Tone.Transport.schedule(() => {
        Tone.Transport.set({
          timeSignature: event.value,
        });
      }, event.at.toString());
    },

    // Set tempo (in bpm)
    tempo: async ({ event }) => {
      this.logger.info(`render.session.event.tempo: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.tempo:     tempo = ${event.value}`);

      return await Tone.Transport.schedule(() => {
        Tone.Transport.set({
          bpm: event.value,
        });
      }, event.at.toString());
    },

    // Set swing constant (0 to 1)
    swing: async ({ event }) => {
      this.logger.info(`render.session.event.swing: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.swing:     swing = ${event.value}`);
    
      return await Tone.Transport.schedule(() => {
        Tone.Transport.set({
          swing: event.value,
        });
      }, event.at.toString());
    },

    // Set key (root note)
    key: async ({ event }) => {
      this.logger.debug(`render.session.event.key: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.key:     key = ${event.value}`);

      return await Tone.Transport.schedule(() => {
        Tone.Transport._key = event.value;
      }, event.at.toString());
    },

    // Set scale/mode (?)
    scale: async ({ event }) => {
      this.logger.debug(`render.session.event.scale: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.scale:     scale = ${event.value}`);

      return await Tone.Transport.schedule(() => {
        Tone.Transport._scale = event.value;
      }, event.at.toString());
    },

    // Set volume (0 to 1)
    volume: async ({ event, track }) => {
      this.logger.todo(`render.session.event.volume: [+] at = ${event.at}`);
      this.logger.todo(`render.session.event.volume:     meter = ${event.value}`);
    },

    // Set pan (-1 to 1)
    pan: async ({ event, track }) => {
      this.logger.todo(`render.session.event.pan: [+] at = ${event.at}`);
      this.logger.todo(`render.session.event.pan:     pan = ${event.value}`);
    },

    // Set mute flag (true or false)
    mute: async ({ event, track }) => {
      this.logger.todo(`render.session.event.mute: [+] at = ${event.at}`);
      this.logger.todo(`render.session.event.mute:     mute = ${event.value}`);
    },

    // Set solo flag (true or false)
    solo: async ({ event, track }) => {
      this.logger.todo(`render.session.event.solo: [+] at = ${event.at}`);
      this.logger.todo(`render.session.event.solo:     solo = ${event.value}`);
    },
    
    // Play a sequence of notes (phrase)
    phrase: async ({ event, track, instrument }) => {
      const phraseName = event.value;
      const phrase = this.renderer.cache.phrases[phraseName];
      const steps = phrase.steps;
      
      let position = Tone.Time(event.at.toString());

      // this.logger.info(`render.session.event.phrase: [+] at = ${event.at}`);
      // this.logger.debug(`render.session.event.phrase:   phrase = ${phraseName}`);
      // this.logger.debug(`render.session.event.phrase:   number of steps = ${phrase.steps.length}`);
      // this.logger.debug(`render.session.event.phrase:   position = ${position.toBarsBeatsSixteenths()}`);
      // this.logger.debug(`render.session.event.phrase:   instrument = ${instrument}`);

      await Tone.Transport.set({
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
              at: event.at.constructor.parse(Tone.Transport.position.toString())
            }),
            track: track,
            instrument: instrument,
          });

        });

        return await Tone.Transport.set({
          position: `+${notes[0].duration.toMBS(track.meterAt(event.at))}`,
        });
      });
    },

    // Play a single note
    note: async ({ event, track, instrument }) => {
      const note = event.value;
      const keySignature = track.keySignatureAt(event.at);
      const meter = track.meterAt(event.at);
      const pitch = note.computedPitch(keySignature);
      const duration = note.duration.toMBS(meter);

      // this.logger.info(`render.session.event.note: [+] position = ${event.at}`);
      // this.logger.debug(`render.session.event.note:     pitch = ${note.pitch} => ${pitch}`);
      // this.logger.debug(`render.session.event.note:     duration = ${duration}`);
      // this.logger.debug(`render.session.event.note:     key signature = ${keySignature}`);
      // this.logger.debug(`render.session.event.note:     instrument = ${instrument}`);

      return Tone.Transport.schedule((time) => {
        if (instrument.triggerAttackRelease.length === 2) {
          instrument.triggerAttackRelease(duration, time);
        }
        else {
          instrument.triggerAttackRelease(pitch, duration, time);
        }

        Tone.Draw.schedule(() => {
          Harmonicon.emit(`play:${pitch.toLowerCase()}`);
        }, time);
      }, event.at.toString());
    }
  }

  get state () {
    return Tone.Transport.state; // started|stopped
  }

  get position () {
    const ticks = Tone.Transport.ticks
    const parts = Tone.Transport.position.split(':');
    const measure = Number(parts[0]);
    const beat = Number(parts[1]);
    const subdivision = Number(parts[2]);
    const realtime = (Math.round(Tone.Transport.seconds * 100) / 100).toFixed(2);
    const tempo = Tone.Transport.bpm.value;
    const swing = Tone.Transport.swing.value;
    const timeSignature = Tone.Transport.timeSignature;
    const meter = timeSignature;

    const key = Tone.Transport._key;
    const scale = Tone.Transport._scale;

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
    return Tone.Transport.cancel(0);
  }

  // Pause transport at current position
  async pause() {
    return Tone.Transport.pause();
  }

  // Stop transport and go back to 0:0:0
  async stop() {
    await Tone.Transport.stop();
  }

  // Play transport from current position
  async play() {
    if (Tone.context.state === 'suspended') {
      await Tone.start();
    }

    return Tone.Transport.start();
  }

  async playNote({ note }) {
    const notes = Array.isArray(note) ? note : [ note ];

    this.previewer = this.previewer || new Tone.PolySynth().toDestination();
    this.previewer.releaseAll();

    this.previewer.triggerAttackRelease(notes.map((note) => {
      return note.computedPitch();
    }), 1);
  }

  on (eventName, fn) {
    Tone.Transport.on(eventName, fn);
  }

  observePosition(fn) {
    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        fn(this.position);
      }, time);
    }, '8n', 0);
  }

  createNode(properties = {}) {
    return new ToneAudioDriverNode(properties);
  }

  async setTransportPosition (position) {
    return Tone.Transport.set({ position })
  }

  async startAudioBuffer() {
    return Tone.start();
  }
}