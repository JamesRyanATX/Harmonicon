import { toneSynthesizerInstrument } from '../helper';

export const pluckSynth = toneSynthesizerInstrument({
  name: 'pluck-synth',
  toneInstrument: 'PluckSynth',
  defaultOptions: {
    volume: 0,
  }
});
