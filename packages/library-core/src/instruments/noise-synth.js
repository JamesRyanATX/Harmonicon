import { toneSynthesizerInstrument } from '../helper';

export const noiseSynth = toneSynthesizerInstrument({
  name: 'noise-synth',
  toneInstrument: 'NoiseSynth',
  defaultOptions: {
    envelope: {},
    noise: {},
    volume: 0,
  }
});
