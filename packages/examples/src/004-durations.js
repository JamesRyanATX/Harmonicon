session('Durations', async ({ session }) => {
  session.at.measure(0)
    .tempo(160)
    .key('d')
    .scale('major');

  session.use.instrument('mono-synth').from.library('core');

  session.phrase('durations', ({ phrase }) => {
    phrase.steps([

      doubleDottedLarge.note(-14),
      dottedLarge.note(-13),
      large.note(-12),
      
      doubleDottedLong.note(-11),
      dottedLong.note(-10),
      long.note(-9),
      
      doubleDottedDoubleWhole.note(-8),
      dottedDoubleWhole.note(-7),
      doubleWhole.note(-6),
      
      doubleDottedWhole.note(-5),
      dottedWhole.note(-4),
      whole.note(-3),
      
      doubleDottedHalf.note(-2),
      dottedHalf.note(-1),
      half.note(0),
      
      doubleDottedQuarter.note(1),
      dottedQuarter.note(2),
      quarter.note(3),

      doubleDottedEighth.note(4),
      dottedEighth.note(5),
      eighth.note(6),
      
      doubleDottedSixteenth.note(7),
      dottedSixteenth.note(8),
      sixteenth.note(9),
      
      doubleDottedThirtySecond.note(10),
      dottedThirtySecond.note(11),
      thirtySecond.note(12),

      doubleDottedSixtyFourth.note(13),
      dottedSixtyFourth.note(14),
      sixtyFourth.note(15),

    ]);
  });

  session.track('durations', async ({ track }) => {
    track.at.measure(0).play.phrase('durations');
  });

  session.send.instrument('mono-synth').to.track('durations');
  session.send.track('durations').to.main();
});