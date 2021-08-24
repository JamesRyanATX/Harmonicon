session('Durations', async ({ session }) => {

  session.instrument('bass', async () => {
    return new Tone.MonoSynth().toDestination();
  });

  session.phrase('durations', ({ phrase }) => {
    phrase.steps([

      doubleDottedLarge.note('A0'),
      dottedLarge.note('B0'),
      large.note('C1'),
      
      doubleDottedLong.note('D1'),
      dottedLong.note('E1'),
      long.note('F1'),
      
      doubleDottedDoubleWhole.note('G1'),
      dottedDoubleWhole.note('A1'),
      doubleWhole.note('B1'),
      
      doubleDottedWhole.note('C2'),
      dottedWhole.note('D2'),
      whole.note('E2'),
      
      doubleDottedHalf.note('F2'),
      dottedHalf.note('G2'),
      half.note('A2'),
      
      doubleDottedQuarter.note('B2'),
      dottedQuarter.note('C3'),
      quarter.note('D3'),

      doubleDottedEighth.note('E3'),
      dottedEighth.note('F3'),      
      eighth.note('G3'),
      
      doubleDottedSixteenth.note('A3'),
      dottedSixteenth.note('B3'),
      sixteenth.note('C4'),
      
      doubleDottedThirtySecond.note('D4'),
      dottedThirtySecond.note('E4'),
      thirtySecond.note('F4'),

      doubleDottedSixtyFourth.note('G4'),
      dottedSixtyFourth.note('C5'),
      sixtyFourth.note('D5'),

    ]);
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(1).play.phrase('durations');
  });

});