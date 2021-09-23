import { toneSynthesizerInstrument } from '../helper';

export const duoSynth = toneSynthesizerInstrument({
  name: 'duo-synth',
  toneInstrument: 'DuoSynth',
  defaultOptions: {
    volume: 0,
  }
});
