export const cello = async ({ library }) => {

  library.instrument('cello', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'G#4': 'Gs4.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg',
        'B2': 'B2.ogg',
        'B3': 'B3.ogg',
        'B4': 'B4.ogg',
        'C2': 'C2.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'E2': 'E2.ogg'  
      },
      baseUrl: '/libraries/core/instruments/cello/',
    });
  });

};
