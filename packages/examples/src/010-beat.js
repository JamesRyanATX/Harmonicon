session('c major scale', async ({ session }) => {
  session.at(0, 0, 0)
    .meter([ 4, 4 ])
    .tempo(160)
    .swing(0)
    .key('d')
    .scale('minor');

  session.use.instrument('drums').from.library('core');
  session.use.instrument('electric-bass').from.library('core');
  session.use.instrument('xylophone').from.library('core');

  session.instrument('bass', async () => {
    return new Tone.MonoSynth({
      volume: -8,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 0,
        attackCurve: "exponential",
        decay: 0,
        decayCurve: "exponential",
        release: 0.1,
        releaseCurve: "exponential",
        sustain: 0.1
      },
      oscillator: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "sine",
        harmonicity: 0,
        modulationType: "sine"
      }
    });
  });

  session.instrument('lead', async () => {
    return new Tone.PluckSynth();
  });

  session.phrase('beat-a', [

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    quarter.note('c4'),

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    eighth.note('c4'),
    eighth.note('g2'),

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    quarter.note('c4'),

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    eighth.note('e4'),
    eighth.note('c2'),

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    quarter.note('c4'),

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    eighth.note('c4'),
    eighth.note('g2'),

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    quarter.note('c4'),

    dottedQuarter.note('c2'),
    eighth.note('c2'),
    quarter.rest(),
    eighth.note('e4'),
    eighth.notes([ 'c2', 'e4' ]),

  ]);

  session.phrase('bass-a', [
    eighth.note(-7),
    eighth.note(-6),
    eighth.note(-1),
    eighth.note(0),
    quarter.rest(),
    quarter.note(-7),

    dottedQuarter.note(-14),
    eighth.note(-14),
    half.rest(),

    dottedQuarter.note(-14),
    eighth.note(-14),
    half.rest(),

    dottedQuarter.note(-14),
    eighth.note(-14),
    half.rest(),

    eighth.note(-7),
    eighth.note(-8),
    eighth.note(-9),
    eighth.note(-10),
    eighth.note(-11),
    eighth.note(-12),
    eighth.note(-13),
    eighth.note(-15),

    dottedQuarter.note(-14),
    eighth.note(-14),
    half.rest(),

    dottedQuarter.note(-14),
    eighth.note(-14),
    half.rest(),

    dottedQuarter.note(-14),
    eighth.note(-14),
    half.rest(),
  ]);

  session.track('drums', async ({ track }) => {
    track.at(1, 0, 0).play.phrase('beat-a');
    track.at(9, 0, 0).play.phrase('beat-a');
  });

  session.track('bass', async ({ track }) => {
    track.at(1, 0, 0).play.phrase('bass-a');
    track.at(9, 0, 0).play.phrase('bass-a');
  });

  session.track('lead', async ({ track }) => {
    track.at(1, 0, 0).play.phrase('bass-a');
    track.at(9, 0, 0).play.phrase('bass-a');
  });

  session.track('xylophone', async ({ track }) => {
    track.at(1, 0, 0).play.phrase('bass-a');
    track.at(9, 0, 0).play.phrase('bass-a');
  });

  session.effect('fx-delay', () => {
    return new Tone.PingPongDelay({
			delayTime: "8n",
			feedback: 0.2,
			wet: 0.2
		});
  });

  session.effect('fx-phaser', () => {
    return new Tone.Phaser({
      wet: 0.75
    });
  });

  session.effect('fx-reverb', () => {
    return new Tone.Reverb({
      wet: 0.5
    });
  });

  session.track('fx', async () => { })

  session.send.instrument('drums').to.track('drums');
  session.send.instrument('bass').to.track('bass');
  session.send.instrument('lead').to.track('lead');
  session.send.instrument('xylophone').to.track('xylophone');

  session.send.track('drums').to.track('fx');
  session.send.track('bass').to.track('fx');
  session.send.track('xylophone').to.track('fx');
  session.send.track('lead').to.track('fx');

  session.send.track('fx').to.effect('fx-delay');
  session.send.effect('fx-delay').to.effect('fx-phaser');
  session.send.effect('fx-phaser').to.effect('fx-reverb');
  session.send.effect('fx-reverb').to.main();


});
