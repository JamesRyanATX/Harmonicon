export const acousticGuitar = async ({ library }) => {

  library.instrument('acoustic-guitar', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'F3': 'F3.ogg',
        'F#1': 'Fs1.ogg',
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'G1': 'G1.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G#1': 'Gs1.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'A1': 'A1.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A#1': 'As1.ogg',
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'B1': 'B1.ogg',
        'B2': 'B2.ogg',
        'B3': 'B3.ogg',
        'C2': 'C2.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C#2': 'Cs2.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'D1': 'D1.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D#1': 'Ds1.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'E1': 'E1.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'F1': 'F1.ogg',
        'F2': 'F2.ogg'  
      },
      baseUrl: '/libraries/core/instruments/acoustic-guitar/',
    });
  });

};