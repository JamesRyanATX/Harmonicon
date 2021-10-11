import { MidiDriver } from '@composer/core';
import { Device } from './device';

export class Driver extends MidiDriver.Driver {

  /* standard api */

  get inputs() {
    return this._inputs || [];
  }

  set inputs(devices) {
    this._inputs = devices;
  }

  get outputs() {
    return this._outputs || [];
  }

  set outputs(devices) {
    this._outputs = devices;
  }

  get authorized() {
    return !!this.midi;
  }

  async authorize() {
    this.midi = await navigator.requestMIDIAccess({ sysex: true })
      .catch((e) => {
        return null;
      });

    if (this.authorized) {
      this.inputs = this.getDevices('inputs');
      this.outputs = this.getDevices('outputs');

      this.logger.info('authorized');
    }
    else {
      this.logger.info('authorization denied');
    }

    return this.authorized;
  }

  /* internal api */

  getDevices(type) {
    if (!this.authorized) {
      return [];
    }

    return Array.from(this.midi[type].values()).map((device) => {
      return Device.parse({
        name: device.name,
        id: device.id,
        device
      })
    });
  }

}