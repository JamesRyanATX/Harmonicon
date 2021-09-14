export const reverb = async ({ library }) => {

  library.effect('reverb', async ({ effect }) => {
    return new Tone.Reverb({
      wet: 0.5
    });
  });

};
