export const xylophone = async ({ library }) => {

  library.instrument('xylophone', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'C7': 'C7.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G5': 'G5.ogg',
        'G6': 'G6.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg'
      },
      baseUrl: '/libraries/core/instruments/xylophone/',
    });
  });

};
