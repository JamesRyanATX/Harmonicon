import { toneSynthesizerInstrument } from '../helper';

export const fmSynth = toneSynthesizerInstrument({
  name: 'fm-synth',
  toneInstrument: 'FMSynth',
  defaultOptions: {
    volume: 0,
  }
});
