export const delay = async ({ library }) => {

  library.effect('delay', async ({ effect }) => {
    return new Tone.PingPongDelay({
    });
  });

};
