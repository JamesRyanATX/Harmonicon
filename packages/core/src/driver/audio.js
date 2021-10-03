import { AudioNodeModel } from '../models/audio_node';
import { BaseDriver } from './base';

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
    this.logger.error(`${this.name}.state not implemented`);
  }

  get position () {
    this.logger.error(`${this.name}.position not implemented`);
  }

  constructor({ driver, session, renderer }) {
    super({ driver });
    this.session = session;
    this.renderer = renderer;
  }

  createNode() {
    this.logger.error('createNode() not implemented');
  }

  observePosition() {
    this.logger.error('observePosition() not implemented');
  }

  async unscheduleAll () {
    this.logger.error('unscheduleAll() not implemented');
  }

  async setTransportPosition() {
    this.logger.error('setTransportPosition() not implemented');
  }

  async play() {
    this.logger.error('play() not implemented');
  }

  async pause() {
    this.logger.error('pause() not implemented');
  }

  async stop() {
    this.logger.error('stop() not implemented');
  }

  async export() {
    this.logger.error('export() not implemented');
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
    this.logger.error('on() not implemented');
  }

  async startAudioBuffer() {
    this.logger.error('startAudioBuffer() not implemented');
  }

  async playNote() {
    this.logger.error('playNote() not implemented');
  }

}
