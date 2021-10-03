import { AudioDriver } from '@composer/core';
import * as ToneAudioDriver from '../';

describe('@composer/driver-audio-tone', function () {
  it('exports the correct objects', function () {
    expect(ToneAudioDriver.Driver.prototype).toBeInstanceOf(AudioDriver.Driver);
    expect(ToneAudioDriver.AudioNode.prototype).toBeInstanceOf(AudioDriver.AudioNode);
    expect(ToneAudioDriver.BackgroundRenderer.prototype).toBeInstanceOf(AudioDriver.Renderer);
    expect(ToneAudioDriver.InteractiveRenderer.prototype).toBeInstanceOf(AudioDriver.Renderer);
  });
});