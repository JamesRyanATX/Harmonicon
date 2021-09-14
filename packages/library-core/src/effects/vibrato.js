export const vibrato = async ({ library }) => {

  library.effect('vibrato', async ({ effect }) => {
    return new Tone.Vibrato({
    });
  });

};
