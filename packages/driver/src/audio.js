import { BaseDriver } from './base';

export class BaseAudioDriver extends BaseDriver {

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

  createNode() {
    this.logger.error('createNode() not implemented');
  }

  observePosition() {
    this.logger.error('observePosition() not implemented');
  }

  async on() {
    this.logger.error('on() not implemented');
  }

  async unscheduleAll () {
    this.logger.error('unscheduleAll() not implemented');
  }

  async startAudioBuffer() {
    this.logger.error('startAudioBuffer() not implemented');
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

}