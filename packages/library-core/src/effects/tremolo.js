export const tremolo = async ({ library }) => {

  library.effect('tremolo', async ({ effect }) => {
    return new Tone.Tremolo({
    });
  });

};
