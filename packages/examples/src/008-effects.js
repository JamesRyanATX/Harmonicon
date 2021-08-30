session('effects', async ({ session }) => {

  // Delay for snare instrument only
  session.effect('snare-delay', () => {
    return new Tone.PingPongDelay({
			delayTime: "8n",
			feedback: 0.2,
			wet: 0.2
		});
  });

  // Reverb for main output
  session.effect('main-reverb', () => {
    return new Tone.Reverb({
      wet: 0.75
    });
  });

  // Basic snare drum patch
  session.instrument('snare', async () => {
    return new Tone.Sampler({
      urls: { 
        'C4': 'snare.wav'
      },
      baseUrl: "/libraries/core/instruments/drums/",
    });
  });

  session.track('snare', async ({ track }) => {
    track.at(1, 0, 0).play(quarter.note('c4'));
  });

  session.send.instrument('snare').to.effect('snare-delay');
  session.send.effect('snare-delay').to.track('snare');

  session.send.track('snare').to.effect('main-reverb');
  session.send.effect('main-reverb').to.main();

});