export const electricGuitar = async ({ library }) => {

  library.instrument('electric-guitar', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'D#5': 'Ds5.ogg',
        'E2': 'E2.ogg',
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'F#5': 'Fs5.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'C#2': 'Cs2.ogg' 
      },
      baseUrl: '/libraries/core/instruments/electric-guitar/',
    });
  });

};
