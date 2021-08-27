export const bassoon = async ({ library }) => {

  library.instrument('bassoon', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'A3': 'A3.ogg',
        'C2': 'C2.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'E3': 'E3.ogg',
        'G1': 'G1.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'A1': 'A1.ogg',
        'A2': 'A2.ogg'
      },
      baseUrl: '/libraries/core/instruments/bassoon/',
    });
  });

};
