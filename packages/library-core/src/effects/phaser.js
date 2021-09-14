export const phaser = async ({ library }) => {

  library.effect('phaser', async ({ effect }) => {
    return new Tone.Phaser({
    });
  });

};
