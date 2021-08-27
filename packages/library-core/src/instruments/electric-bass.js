export const electricBass = async ({ library }) => {

  library.instrument('electric-bass', async () => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg',
        'A#5': 'As5.ogg',
        'C#2': 'Cs2.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'C#5': 'Cs5.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G5': 'G5.ogg'
      },
      baseUrl: '/libraries/core/instruments/electric-bass/',
    });
  });

};