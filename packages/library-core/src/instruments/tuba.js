export const tuba = async ({ library }) => {

  library.instrument('tuba', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        'A#1': 'As1.ogg',
        'A#2': 'As2.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D#1': 'Ds1.ogg',
        'F0': 'F0.ogg',
        'F1': 'F1.ogg',
        'F2': 'F2.ogg',
        'A#0': 'As0.ogg'    
      },
      baseUrl: '/libraries/core/instruments/tuba/',
    });
  });

};
