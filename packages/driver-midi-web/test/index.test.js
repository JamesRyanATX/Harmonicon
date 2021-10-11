import { MidiDriver } from '@composer/core';
import * as WebMidiDriver from '../';

describe('@composer/driver-midi-web', function () {
  it('exports the correct objects', function () {
    expect(WebMidiDriver.Driver.prototype).toBeInstanceOf(MidiDriver.Driver);
    expect(WebMidiDriver.Device.prototype).toBeInstanceOf(MidiDriver.Device);
    expect(WebMidiDriver.Message.prototype).toBeInstanceOf(MidiDriver.Message);
  });
});