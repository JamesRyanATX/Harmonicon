export const flute = async ({ library }) => {

  library.instrument('flute', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'A5': 'A5.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg'   
      },
      baseUrl: '/libraries/core/instruments/flute/',
    });
  });

};
