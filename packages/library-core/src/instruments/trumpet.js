export const trumpet = async ({ library }) => {

  library.instrument('trumpet', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'C5': 'C5.ogg',
        'D4': 'D4.ogg',
        'D#3': 'Ds3.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'G3': 'G3.ogg',
        'A2': 'A2.ogg',
        'A4': 'A4.ogg',
        'A#3': 'As3.ogg',
        'C3': 'C3.ogg'  
      },
      baseUrl: '/libraries/core/instruments/trumpet/',
    });
  });

};
