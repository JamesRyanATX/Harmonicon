session('multitrack', async ({ session }) => {
  session.at(0, 0, 0)
    .tempo(80)
    .swing(0)
    .key('a')
    .scale('minor');

  let reverb
  let chorus;

  session.instrument('reverb', async () => {
    return reverb = new Tone.Reverb({
      wet: 0.5
    }).toDestination();
  })

  session.instrument('chorus', async () => {
    return chorus = new Tone.Chorus(4, 2.5, 0.5).connect(reverb).start();
  });

  session.instrument('beat', async () => {
    const delay = new Tone.PingPongDelay({
			delayTime: "16n",
			feedback: 0.6,
			wet: 0.4
		}).connect(reverb);

    return new Tone.MembraneSynth({
      volume: -15
    }).connect(delay);
  });

  session.instrument('bass', async () => {
    return new Tone.Synth({
      volume: -10,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0.5,
        attackCurve: "exponential",
        decay: 0,
        decayCurve: "exponential",
        release: 1.5,
        releaseCurve: "exponential",
        sustain: 0.2
      },
      oscillator: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "sine",
        harmonicity: 0,
        modulationType: "sine"
      }
    }).toDestination();
  });

  session.instrument('harp', async () => {
    return new Tone.Sampler({
      volume: -20,
			urls: {
        'C5': 'C5.ogg',
        'D2': 'D2.ogg',
        'D4': 'D4.ogg',
        'D6': 'D6.ogg',
        'D7': 'D7.ogg',
        'E1': 'E1.ogg',
        'E3': 'E3.ogg',
        'E5': 'E5.ogg',
        'F2': 'F2.ogg',
        'F4': 'F4.ogg',
        'F6': 'F6.ogg',
        'F7': 'F7.ogg',
        'G1': 'G1.ogg',
        'G3': 'G3.ogg',
        'G5': 'G5.ogg',
        'A2': 'A2.ogg',
        'A4': 'A4.ogg',
        'A6': 'A6.ogg',
        'B1': 'B1.ogg',
        'B3': 'B3.ogg',
        'B5': 'B5.ogg',
        'B6': 'B6.ogg',
        'C3': 'C3.ogg'
      },
			//release: 1,
			baseUrl: "/instruments/core/harp/",
		}).connect(reverb);
  });

  session.instrument('trombone', async () => {
    return new Tone.Sampler({
      volume: -10,
			urls: {
        'A#2': 'As2.ogg',
        'C2': 'C2.ogg',
        'C3': 'C3.ogg',
        'C#1': 'Cs1.ogg',
        'C#3': 'Cs3.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D#1': 'Ds1.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'F1': 'F1.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'G#1': 'Gs1.ogg',
        'G#2': 'Gs2.ogg',
        'A#0': 'As0.ogg',
        'A#1': 'As1.ogg'
      },
			//release: 1,
			baseUrl: "/instruments/core/trombone/",
		}).connect(reverb);
  });

  session.phrase('beat', ({ phrase }) => {
    phrase.steps([
      quarter.note('c1'),
      eighth.note('c1'),
      eighth.note('c2'),
      quarter.note('c1'),
      eighth.note('c1'),
      eighth.note('c2'),
    ])
  });

  session.phrase('bass-line', ({ phrase }) => {
    phrase.steps([
      whole.note(-21),
      whole.note(-22),
      whole.note(-19),
      whole.note(-19),
      whole.note(-21),
      whole.note(-22),
      whole.note(-19),
      whole.note(-19),
    ]);
  });

  session.phrase('harp-line', ({ phrase }) => {
    phrase.steps([
      eighth.note(0),
      eighth.note(3),
      dottedHalf.note(5),
      whole.note(4)
    ]);
  });

  session.track('trombone', async ({ track }) => {
    track.at(7, 0, 0).play(long.note(-14));
    track.at(9, 0, 0).play(long.note(-15));
    track.at(11, 0, 0).play(long.note(-14));
    track.at(13, 0, 0).play(long.note(-15));
    track.at(15, 0, 0).play(long.note(-14));
    track.at(17, 0, 0).play(long.note(-11));
    //track.at(7, 0, 0).play(long.note(-12));
    //track.at(7, 0, 0).play(long.note(-7));
  });

  session.track('bass', async ({ track }) => {
    track.at(3, 0, 0).play.phrase('bass-line');
    track.at(11, 0, 0).play.phrase('bass-line');
  });

  session.track('harp', async ({ track }) => {
    track.at(3, 0, 0).play.phrase('harp-line');
    track.at(7, 0, 0).play.phrase('harp-line');
    track.at(11, 0, 0).play.phrase('harp-line');
  });

  session.track('beat', async ({ track }) => {
    for (let i = 1; i <= 16; i += 1) {
      track.at(i, 0, 0).play.phrase('beat');
    }
  });

  session.send.instrument('trombone').to.track('trombone');
  session.send.track('trombone').to.main();

  session.send.instrument('bass').to.track('bass');
  session.send.track('bass').to.main();

  session.send.instrument('harp').to.track('harp');
  session.send.track('harp').to.main();

  session.send.instrument('beat').to.track('beat');
  session.send.track('beat').to.main();

});