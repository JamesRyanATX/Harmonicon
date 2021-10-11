import { AudioNodeModel } from '../models/audio_node';
import { BaseDriver } from './base';
import { DriverError } from '../errors';

export class AudioNode extends AudioNodeModel {
}

export class Device {
  constructor({ driver }) {
    this.driver = driver;
  }

  get logger() {
    return this.driver.logger;
  }
}

export class Renderer extends Device {

  schedulers = {
    end: null,
    key: null,
    meter: null,
    mute: null,
    note: null,
    pan: null,
    phrase: null,
    scale: null,
    solo: null,
    swing: null,
    tempo: null,
    volume: null,
  }

  get state () {
    throw new DriverError('#state not implemented');
  }

  get position () {
    throw new DriverError('#activate() not implemented');
  }

  constructor({ driver, session, renderer }) {
    super({ driver });
    this.session = session;
    this.renderer = renderer;
  }

  createNode() {
    throw new DriverError('#createNode() not implemented');
  }

  observePosition() {
    throw new DriverError('#observePosition() not implemented');
  }

  setPosition() {
    throw new DriverError('#setPosition() not implemented');
  }

  unscheduleAll () {
    throw new DriverError('#unscheduleAll() not implemented');
  }

  
  /* player controls */

  play() {
    throw new DriverError('#play() not implemented');
  }

  pause() {
    throw new DriverError('#pause() not implemented');
  }

  stop() {
    throw new DriverError('#stop() not implemented');
  }

}

export class Driver extends BaseDriver {
  static loggerName = 'AudioDriver';

  createInteractiveRenderer ({ session, renderer }) {
    return new Renderer({
      driver: this, session, renderer
    });
  }

  createBackgroundRenderer ({ session, renderer }) {
    return new Renderer({
      driver: this, session, renderer
    });
  }

  async on() {
    throw new DriverError('#on() not implemented');
  }

  async startAudioBuffer() {
    throw new DriverError('#startAudioBuffer() not implemented');
  }

  async playNote() {
    throw new DriverError('#playNote() not implemented');
  }

}
