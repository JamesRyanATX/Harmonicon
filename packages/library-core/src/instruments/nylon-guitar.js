export const nylonGuitar = async ({ library }) => {

  library.instrument('nylon-guitar', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'F#5': 'Fs5.ogg',
        'G3': 'G3.ogg',
        'G5': 'G3.ogg',
        'G#2': 'Gs2.ogg',
        'G#4': 'Gs4.ogg',
        'G#5': 'Gs5.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'A#5': 'As5.ogg',
        'B1': 'B1.ogg',
        'B2': 'B2.ogg',
        'B3': 'B3.ogg',
        'B4': 'B4.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'C#5': 'Cs5.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D5': 'D5.ogg',
        'D#4': 'Ds4.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg'   
      },
      baseUrl: '/libraries/core/instruments/nylon-guitar/',
    });
  });

};