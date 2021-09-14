export const distortion = async ({ library }) => {

  library.effect('distortion', async ({ effect }) => {
    return new Tone.Distortion({
    });
  });

};
