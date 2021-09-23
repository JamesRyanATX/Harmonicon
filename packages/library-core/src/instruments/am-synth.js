import { toneSynthesizerInstrument } from '../helper';

export const amSynth = toneSynthesizerInstrument({
  name: 'am-synth',
  toneInstrument: 'AMSynth',
  defaultOptions: {
    volume: 0,
  }
});
