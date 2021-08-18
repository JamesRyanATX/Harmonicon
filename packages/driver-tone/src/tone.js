import { BaseAudioDriver } from '@composer/driver';
import { mapSeries } from '@composer/util';
import * as Tone from 'tone';


export class ToneDriver extends BaseAudioDriver {

  schedulers = {

    // Set meter (time signature formatted as [ a, b ])
    meter: async ({ event }) => {
      this.logger.info(`render.session.event.meter: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.meter:     meter = ${event.value}`);

      Tone.Transport.set({
        position: event.at.toMBS(),
        timeSignature: event.value,
      });
    },

    // Set tempo (in bpm)
    tempo: async ({ event }) => {
      this.logger.info(`render.session.event.tempo: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.tempo:     tempo = ${event.value}`);

      Tone.Transport.set({
        position: event.at.toMBS(),
        bpm: event.value,
      });
    },

    // Set swing constant (0 to 1)
    swing: async ({ event }) => {
      this.logger.info(`render.session.event.swing: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.swing:     swing = ${event.value}`);
    
      Tone.Transport.set({
        position: event.at.toMBS(),
        swing: event.value,
      });
    },

    // Set key (root note)
    key: async ({ event }) => {
      this.logger.debug(`render.session.event.key: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.key:     key = ${event.value}`);
    },

    // Set scale/mode (?)
    scale: async ({ event }) => {
      this.logger.debug(`render.session.event.scale: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.scale:     scale = ${event.value}`);
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
      const phrase = this.phrases[phraseName];
      const steps = phrase.steps;
      
      let position = Tone.Time(event.at.toString());

      this.logger.info(`render.session.event.phrase: [+] at = ${event.at}`);
      this.logger.debug(`render.session.event.phrase:   phrase = ${phraseName}`);
      this.logger.debug(`render.session.event.phrase:   number of steps = ${phrase.steps.length}`);
      this.logger.debug(`render.session.event.phrase:   position = ${position.toBarsBeatsSixteenths()}`);
      this.logger.debug(`render.session.event.phrase:   instrument = ${instrument}`);

      await Tone.Transport.set({
        position: position.toBarsBeatsSixteenths()
      });

      return await mapSeries(steps, async (step) => {
        await this.schedulers.note.call(this, {
          event: event.constructor.parse({
            value: step,
            at: event.at.constructor.parse(Tone.Transport.position.toString())
          }),
          track: track,
          instrument: instrument
        });

        return await Tone.Transport.set({
          position: `+${step.duration.definition.fraction[1]}n`,
        });
      });
    },

    // Play a single note
    note: async ({ event, track, instrument }) => {
      const note = event.value;
      const duration = `0:${note.duration.toDecimal()}:0`;
      const keySignature = track.keySignatureAt(event.at);
      const pitch = note.computedPitch(keySignature);

      this.logger.info(`render.session.event.note: [+] position = ${event.at}`);
      this.logger.debug(`render.session.event.note:     pitch = ${note.pitch} => ${pitch}`);
      this.logger.debug(`render.session.event.note:     duration = ${duration}`);
      this.logger.debug(`render.session.event.note:     key signature = ${keySignature}`);
      this.logger.debug(`render.session.event.note:     instrument = ${instrument}`);

      return await Tone.Transport.schedule((time) => {
        instrument.triggerAttackRelease(pitch, duration, time);
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

    return { ticks, measure, beat, subdivision, realtime }
  }

  // Remove all events from timeline
  unscheduleAll() {
    return Tone.Transport.cancel(0);
  }

  // Pause transport at current position
  pause() {
    return Tone.Transport.pause();
  }

  // Play transport from current position
  play() {
    return Tone.Transport.start();
  }

  async startAudioBuffer() {
    return Tone.start();
  }

  async setTransportPosition (position) {
    return Tone.Transport.set({ position })
  }

  async stopAudioBuffer() {
  }

  async resetAudioBuffer() {
  }

}