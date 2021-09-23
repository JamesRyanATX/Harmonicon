import { toneSynthesizerInstrument } from '../helper';

export const monoSynth = toneSynthesizerInstrument({
  name: 'mono-synth',
  toneInstrument: 'MonoSynth',
  defaultOptions: {
    volume: 0,
  }
});
