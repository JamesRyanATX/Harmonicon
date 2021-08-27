export const contrabass = async ({ library }) => {

  library.instrument('contrabass', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'C1': 'C1.ogg',
        'C#2': 'Cs2.ogg',
        'D1': 'D1.ogg',
        'E1': 'E1.ogg',
        'E2': 'E2.ogg',
        'F#0': 'Fs0.ogg',
        'F#1': 'Fs1.ogg',
        'G0': 'G0.ogg',
        'G#1': 'Gs1.ogg',
        'G#2': 'Gs2.ogg',
        'A1': 'A1.ogg',
        'A#0': 'As0.ogg',
        'B2': 'B2.ogg'  
      },
      baseUrl: '/libraries/core/instruments/contrabass/',
    });
  });

};
