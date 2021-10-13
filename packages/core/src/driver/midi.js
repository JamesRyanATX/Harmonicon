import { Model } from '@composer/util';
import { BaseDriver } from './base';
import { DriverError } from '../errors';


/**
 * Convert a midi note into a pitch
 */
export function midiToPitch(midi) {
	const octave = Math.floor(midi / 12) - 1;
	return midiToPitchClass(midi) + octave.toString();
}

/**
 * Convert a midi note to a pitch class (just the pitch no octave)
 */
export function midiToPitchClass(midi) {
	const scaleIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	const note = midi % 12;
	return scaleIndexToNote[note];
}


export class Message extends Model {
  static properties = {
    ccMode: {},
    channel: {},
    data: {},
    note: {},
    number: {},
    raw: {},
    timestamp: {},
    type: {},
    value: {},
    velocity: {},
    velocity: {},
  }
}

Message.init();

export class Device extends Model {
  get loggerGroup() { return 'MidiDriver'; }
  get loggerName() { return 'Device'; }

  static properties = {
    device: {},
    name: {},
    id: {}
  }

  constructor(properties) {
    super(properties);

    this.allow('message');
  }

  activate() {
    throw new DriverError('#activate() not implemented');
  }

  deactivate() {
    throw new DriverError('#deactivate() not implemented');
  }
}

Device.init();


export class Driver extends BaseDriver {
  get loggerGroup() { return 'MidiDriver'; }
  get loggerName() { return 'Driver'; }

  get authorized() {
    throw new DriverError('#authorized not implemented');
  }

  get inputs() {
    throw new DriverError('#authorized not implemented');
  }

  get outputs() {
    throw new DriverError('#authorized not implemented');
  }

  authorize () {
    throw new DriverError('#authorize() not implemented');
  }

}