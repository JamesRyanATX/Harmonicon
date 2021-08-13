import { BaseDriver } from '@composer/driver';
import * as Tone from 'tone';


export class ToneDriver extends BaseDriver {

  schedulers = {

    // Play a sequence of notes (phrase)
    phrase: async ({ event, track, instrument }) => {
      const phraseName = event.value;
      const phrase = this.phrases[phraseName];
      const steps = phrase.steps;
      
      let position = Tone.Time(event.at.toString());

      this.logger.debug(`render.session.event.phrase: phrase = ${phraseName}`);
      this.logger.debug(`render.session.event.phrase: number of steps = ${phrase.steps.length}`);
      this.logger.debug(`render.session.event.phrase: position = ${position.toBarsBeatsSixteenths()}`);

      Tone.Transport.set({
        position: position.toBarsBeatsSixteenths()
      });

      steps.forEach((step) => {
        this.logger.debug(`render.session.event.phrase: + position = ${Tone.Transport.position}`);
        this.logger.debug(`render.session.event.phrase:   duration = ${step.duration.toDecimal()}`);
        this.logger.debug(`render.session.event.phrase:   step = ${JSON.stringify(step)}`);

        this.schedulers.note.call(this, {
          event: event.constructor.parse({
            value: step,
            at: event.at.constructor.parse(Tone.Transport.position.toString())
          }),
          track: track,
          instrument: instrument
        });

        Tone.Transport.set({
          position: `+${step.duration.definition.fraction[1]}n`,
        });
      });
    },

    // Play a single note
    note: async ({ event, track, instrument }) => {
      const note = event.value;
      const pitch = note.computedPitch();
      const duration = `0:${note.duration.toDecimal()}:0`;

      this.logger.debug(`render.session.event.note: pitch = ${note.pitch} => ${pitch}`);
      this.logger.debug(`render.session.event.note: duration = ${duration}`);

      Tone.Transport.schedule((time) => {
        instrument.triggerAttackRelease(pitch, duration, time);
      }, event.at.toString());
    }
  }

  play() {
    Tone.Transport.start();
  }

  markTime() {
    setInterval(() => {
      const parts = Tone.Transport.position.split(':');
      const measure = parts[0];
      const beat = parts[1];
      const realtime = Math.round(Tone.Transport.seconds);

      this.logger.debug(`markTime: realtime = ${realtime}s; measure = ${measure}; beat = ${beat}`);
    }, 500);
  }

  async scheduleTrackEvent({ event }) {
    const scheduler = this.schedulers[event.type];

    if (scheduler) {
      return scheduler.apply(this, arguments);
    }
    else {
      this.logger.error(`missing scheduler for type "${event.type}"`);
    }
  }

  async startAudioBuffer() {
    this.logger.debug('starting ToneJS audio buffer');
    await Tone.start();
    this.logger.debug('ready for business');
  }

  async setTransportPosition (position) {
    Tone.Transport.set({ position })
  }

  async stopAudioBuffer() {
  }

  async resetAudioBuffer() {
  }

}