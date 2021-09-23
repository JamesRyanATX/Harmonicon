import { toneSynthesizerInstrument } from '../helper';

export const metalSynth = toneSynthesizerInstrument({
  name: 'metal-synth',
  toneInstrument: 'MetalSynth',
  defaultOptions: {
    volume: 0,
  }
});
