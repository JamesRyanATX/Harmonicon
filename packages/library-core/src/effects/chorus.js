export const chorus = async ({ library }) => {

  library.effect('chorus', async ({ effect }) => {
    return new Tone.Chorus({
    });
  });

};
