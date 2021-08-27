export const drums = async ({ library }) => {

  library.instrument('drums', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
      },
      baseUrl: '/libraries/core/instruments/drums/',
    });
  });

};
