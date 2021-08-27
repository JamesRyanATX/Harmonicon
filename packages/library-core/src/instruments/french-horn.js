export const frenchHorn = async ({ library }) => {

  library.instrument('french-horn', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'D2': 'D2.ogg',
        'D4': 'D4.ogg',
        'D#1': 'Ds1.ogg',
        'F2': 'F2.ogg',
        'F4': 'F4.ogg',
        'G1': 'G1.ogg',
        'A0': 'A0.ogg',
        'A2': 'A2.ogg',
        'C1': 'C1.ogg',
        'C3': 'C3.ogg',  
      },
      baseUrl: '/libraries/core/instruments/french-horn/',
    });
  });

};
