export const pitchShift = async ({ library }) => {

  library.effect('pitch-shift', async ({ effect }) => {
    return new Tone.PitchShift({
    });
  });

};
