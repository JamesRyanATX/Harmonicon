import { toneSynthesizerInstrument } from '../helper';

export const synth = toneSynthesizerInstrument({
  name: 'synth',
  toneInstrument: 'Synth',
  defaultOptions: {
    volume: 0,
  }
});
