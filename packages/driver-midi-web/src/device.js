import { MidiDriver } from '@composer/core';
import { MidiMessage } from 'midi-message-parser';
import { Message } from './message';

export class Device extends MidiDriver.Device {

  /* standard api */

  activate() {
    this.device.onmidimessage = this.onMessage.bind(this);
  }

  deactivate() {
    this.device.onmidimessage = null;
  }

  /* internal */

  static emittableTypes = [
    'noteon',
    'noteoff'
  ]

  onMessage(raw) {
    const data = Array.from(raw.data);
    const parsed = new MidiMessage(data, raw.timeStamp);

    if (this.constructor.emittableTypes.indexOf(parsed.type) === -1) {
      return;
    }

    this.logger.debug(`${parsed.timestamp}: ${data.join(', ')} (${parsed.type})`);

    const message = Message.parse(Object.assign({ raw }, parsed, {
      note: MidiDriver.midiToPitch(parsed.note)
    }));

    this.emit('message', message);
  }

}

Device.init();
