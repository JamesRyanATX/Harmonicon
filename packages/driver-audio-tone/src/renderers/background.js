import { BaseRenderer } from './base';

export class BackgroundRenderer extends BaseRenderer {
  get loggerName() { return 'BackgroundRenderer' };
  get interactive() { return false; }

  get transport() {
    return this._transport;
  }

  set transport(transport) {
    this._transport = transport;
  }

  unscheduleAll() {
    // Override super with nothing; transport is read-only
  }

  async renderToBuffer({ channels, sampleRate, duration }, fn) {
    return Tone.Offline(async ({ transport }) => {

      // Set the offline transport so its available to other methods
      this.transport = transport;

      // Do arbitrary stuff
      await fn();

      // Set transport back to beginning
      this.setPosition(0);

      // Begin writing audio to buffer
      return this.play();

    }, duration, channels, sampleRate);
  }
}
