session('Drums', async ({ session }) => {
  session.at(0, 0, 0)
    .tempo(90)
    .swing(0)
    .key('a')
    .scale('minor');

  session.phrase('quarters', ({ phrase }) => {
    phrase.steps([
      quarter.note('c4'),
      quarter.note('c4'),
      quarter.note('c4'),
      quarter.note('c4'),
    ])
  });

  [
    'kick',
    'kick-light',
    'snare',
    'snare-2',
    'snare-off',
    'snare-rim',
    'snare-rimshot',
    'snare-rimshot-2',
    'snare-roll',
    'snare-roll-short',
    'snare-roll-short-2',
    'sidestick',
    'sidestick-2',
    'tom',
    'tom-light',
    'hihat',
    'hihat-2',
    'hihat-3',
    'hihat-open',
    'hihat-open-2',
    'hihat-open-3',
    'ride',
    'ride-bell',
    'ride-bell-loud',
    'perc-1',
    'perc-2',
    'perc-3',
    'perc-4',
    'perc-5',
  ].forEach((instrumentName, i) => {
    session.instrument(instrumentName, async () => {
      return new Tone.Sampler({
        volume: 0,
        urls: { 'C4': `${instrumentName}.wav` },
        baseUrl: "/libraries/core/instruments/drums/",
      }).toDestination();
    });

    session.track(instrumentName, async ({ track }) => {
      track.at(i, 0, 0).play.phrase('quarters');
    });

    session.send.instrument(instrumentName).to.track(instrumentName);
    session.send.track(instrumentName).to.main();
  });

});