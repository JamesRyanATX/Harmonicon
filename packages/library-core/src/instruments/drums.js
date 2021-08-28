export const drums = async ({ library }) => {

  library.instrument('drums', async ({ instrument }) => {
    return new Tone.Sampler({
      volume: 0,
      urls: {
        
        'c2': 'kick.wav',
        'g2': 'kick-light.wav',

        'c3': 'tom.wav',
        'g3': 'tom-light.wav',
        
        'c4': 'snare.wav',
        'c#4': 'snare-2.wav',
        'd4': 'snare-off.wav',
        'd#4': 'snare-rim.wav',
        'e4': 'snare-rimshot.wav',
        'f4': 'snare-rimshot-2.wav',
        'f#4': 'snare-roll.wav',
        'g4': 'snare-roll-short.wav',
        'g#4': 'snare-roll-short-2.wav',
        'a4': 'sidestick.wav',
        'a#4': 'sidestick-2.wav',
        
        'c5': 'hihat.wav',
        'c#5': 'hihat-2.wav',
        'd5': 'hihat-3.wav',
        'd#5': 'hihat-open.wav',
        'e5': 'hihat-open-2.wav',
        'f5': 'hihat-open-3.wav',
        'f#5': 'ride.wav',
        'g5': 'ride-bell.wav',
        'g#5': 'ride-bell-loud.wav',
        
        'c6': 'perc-1.wav',
        'd#6': 'perc-2.wav',
        'd6': 'perc-3.wav',
        'd#6': 'perc-4.wav',
        'e6': 'perc-5.wav',

      },
      baseUrl: '/libraries/core/instruments/drums/',
    });
  });

};
