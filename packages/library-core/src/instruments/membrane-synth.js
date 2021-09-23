import { toneSynthesizerInstrument } from '../helper';

export const membraneSynth = toneSynthesizerInstrument({
  name: 'membrane-synth',
  toneInstrument: 'MembraneSynth',
  defaultOptions: {
    volume: 0,
  }
});
