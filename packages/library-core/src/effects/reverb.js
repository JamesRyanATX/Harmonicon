import { toneEffect } from '../helper';

export const reverbEffect = toneEffect({
  name: 'reverb',
  toneEffect: 'Reverb',
  defaultOptions: {
    decay: 0.5,
    preDelay: 0,
    wet: 0.5
  }
});