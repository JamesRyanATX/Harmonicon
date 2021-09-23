import { toneSynthesizerInstrument } from '../helper';

export const polySynth = toneSynthesizerInstrument({
  name: 'poly-synth',
  toneInstrument: 'PolySynth',
  defaultOptions: {
    volume: 0,
  }
});
