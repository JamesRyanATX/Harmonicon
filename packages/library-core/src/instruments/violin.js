export const violin = async ({ library }) => {

  library.instrument('violin', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'A6': 'A6.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'C7': 'C7.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg',
        'E6': 'E6.ogg',
        'G4': 'G4.ogg',
        'G5': 'G5.ogg',
        'G6': 'G6.ogg'   
      },
      baseUrl: '/libraries/core/instruments/violin/',
    });
  });

};
