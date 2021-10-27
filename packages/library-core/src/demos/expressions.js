export const expressionsDemo = ({ library }) => {

  library.demo('Expressions', ({ demo }) => {
    demo.source(`/**
*    __ _____   ___  __  _______  _  _______________  _  __
*   / // / _ | / _  /  |/  / __  / |/ /  _/ ___/ __  / |/ /
*  / _  / __ |/ , _/ /|_/ / /_/ /    // // /__/ /_/ /    / 
* /_//_/_/ |_/_/|_/_/  /_/\\____/_/|_/___/\\___/\\____/_/|_/  
*
* ===========================================================
* 
* Harmonicon is an experimental music-as-code DAW for your 
* browser.  It's like GarageBand, but for code!
* 
* Features:
* 
*  - A high-level composition language rooted in music theory
*  - Baked in library of instruments and synthesizers
*  - Multi-track sequencing
*  - Effects, loops, sends, etc.
*  - Powered by the Web Audio API, Tonejs, Tonaljs, Monaco,
*    and a multitude of other things.
* 
* This project is experimental, so use at your own risk :-)
* 
* Click the [PLAY] button to hear what this file sounds like.
* 
*/

session('expressions', ({ session }) => {
  session.at(0)
    .meter([ 4, 4 ])
    .tempo(102) 
    .swing(0)
    .key('c')
    .scale('major');

  session.use('instrument.acoustic-guitar', {
    volume: -20,
  }).as('random-1');

  session.use('instrument.electric-guitar', {
    volume: -18,
  }).as('random-2');

  session.use('instrument.membrane-synth', {
    volume: -8,
  }).as('random-3');

  session.use('instrument.choir', {
    volume: -12,
  }).as('random-4');

  session.use('instrument.piano', { 
    volume: -8
  }).as('piano');

  session.use('instrument.drums', {
    volume: 0
  });

  session.use('instrument.mono-synth', {
    volume: -9,
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
  }).as('bass');

  session.phrase('random-a', [
    eighth.note('c3')
      .multiply(64)
      .cycle('pitch', [ 0, 2, 4, 8, -7, -1 ]),
    eighth.note('c3')
      .multiply(16)
      .cycle('pitch', [ 'Bb2', 'D3', 'F3', 'D3', 'G3' ]),
    eighth.note('c3')
      .multiply(16)
      .cycle('pitch', [ 'A3', 'C#3', 'E3', 'G#3' ]),
    eighth.note('c3')
      .multiply(32)
      .bounce('pitch', [ 'G3', 'B3', 'D3', 'F#3', 'G4' ]),
  ]);

  session.phrase('bass-a', [
    whole.note('c2'), 
    whole.note('g1'),
    whole.note('c2'), 
    whole.note('g1'),

    whole.note('c2'),
    whole.note('g1'),
    whole.note('c1'),
    whole.note('g1'),

    doubleWhole.note('bb1'),
    doubleWhole.note('a1'),
    long.note('g1')
  ]);

  session.phrase('chords-a', [
    whole.note('c2 e2 a2'), 
    whole.note('g1 e2 g2'),
    whole.note('c1 c2 e2 a2'),
    whole.note('g1 e2 g2'),

    whole.note('c2 e2 a2'),
    whole.note('g1 e2 g2'),
    whole.note('c1 c2 e2 a2'),
    whole.note('g1 e2 g2'),

    doubleWhole.note('*Bbmaj7', { octave: 2 }),
    doubleWhole.note('*Amaj7', { octave: 2 }),
    long.note('*Gmaj7', { octave: 2 })
  ]);

  session.track('random-1', ({ track }) => {
    track.at(0).pan(-1);
    track.at(16).play.phrase('random-a');
  })

  session.track('random-2', ({ track }) => {
    track.at(0).pan(1);
    track.at(16).pan(1).play.phrase('random-a');
  })

  session.track('random-4', ({ track }) => {
    track.at(0).play.phrase([
      doubleWhole.rest(),
      doubleWhole.rest(),
      doubleWhole.rest(),
      doubleWhole.rest(),

      doubleWhole.note('*Bbmaj7', { octave: 3 }),
      doubleWhole.note('*Amaj7', { octave: 3 }),
      doubleWhole.note('*Gmaj7', { octave: 3 }),
    ]);

    track.at(16).play.phrase([
      doubleWhole.note('c4 e3'), 
      doubleWhole.note('b3 d3'), 

      doubleWhole.note('c4 e3'), 
      doubleWhole.note('b3 d3'), 

      doubleWhole.note('*Bbmaj7', { octave: 3 }),
      doubleWhole.note('*Amaj7', { octave: 3 }),
      long.note('*Gmaj7', { octave: 3 })
    ]);
  })

  session.track('bass', ({ track }) => {
    track.at(0).play.phrase('bass-a');
    track.at(16).play.phrase('bass-a');
  })

  session.track('piano', ({ track }) => {
    track.at(0).play.phrase('chords-a');
    track.at(16).play.phrase('chords-a');
  })

  session.phrase('drums-a', [
    half.note('c1'),
    half.note('tom'),
    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),

    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),

    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),

    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),
    half.note('kick'),
    half.note('tom sidestick'),
    quarter.note('kick'),
    quarter.note('kick'),
    half.note('tom sidestick'),

  ]);

  session.phrase('drums-b-4m', [
    half.note('kick'),
    half.note('tom'),
    sixteenth.note('kick'),
    sixteenth.note('kick'),
    eighth.rest(),
    sixteenth.note('kick'),
    sixteenth.note('kick'),
    eighth.rest(),
    half.note('snarerimshot tom'),

    half.note('kick'),
    half.note('tom'),
    sixteenth.note('kick'),
    sixteenth.note('kick'),
    eighth.rest(),
    sixteenth.note('kick'),
    sixteenth.note('kick'),
    eighth.rest(),
    half.note('snarerimshot tom'),
  ])

  session.track('drums', ({ track }) => {
    track.at(0).play.phrase('drums-a');

    track.at(16).play.phrase('drums-b-4m');
    track.at(20).play.phrase('drums-b-4m');
    track.at(24).play.phrase('drums-b-4m');
    track.at(28).play.phrase([
      quarter.note('ridebell').multiply(16)
    ])
  });

  session.track('random-3', ({ track }) => {
    track.at(0).volume(-8);

    track.at(15).play.phrase([
      half.rest(),
      thirtySecond.note('c0').multiply(16)
        .curve('pitch', { from: 'c1', to: 'c0' })
    ]);
  });


  // Effects
  // -------

  session.use('effect.reverb', {
    decay: 5,
    preDecay: 2,
    wet: 0.4,
  });

  session.use('effect.vibrato', {
  })

  session.use('effect.delay', {
    delayTime: "8n",
    feedback: 0.4,
    wet: 0.3,
  });

  session.track('space-fx', () => {});
  session.track('reverb-fx', () => {});
  session.track('delay-fx', () => {});

  session.send.instrument('random-1').to.track('random-1');
  session.send.instrument('random-2').to.track('random-2');
  session.send.instrument('random-3').to.track('random-3');
  session.send.instrument('random-4').to.track('random-4');
  session.send.instrument('bass').to.track('bass');
  session.send.instrument('piano').to.track('piano');
  session.send.instrument('drums').to.track('drums');

  session.send.track('random-1').to.track('delay-fx');
  session.send.track('random-2').to.track('delay-fx');
  session.send.track('random-3').to.track('delay-fx');
  session.send.track('random-4').to.track('delay-fx');
  session.send.track('piano').to.track('space-fx');
  session.send.track('drums').to.track('reverb-fx');
  session.send.track('bass').to.effect('compressor');

  session.send.track('delay-fx').to.effect('delay');
  session.send.effect('delay').to.track('reverb-fx');

  session.send.track('space-fx').to.effect('vibrato');
  session.send.effect('vibrato').to.effect('compressor');

  session.send.track('reverb-fx').to.effect('reverb');
  session.send.effect('reverb').to.effect('compressor');


  session.effect('compressor', () => {
    return new Tone.Compressor();
  })

  session.send.effect('compressor').to.main();

});

    `.trim());
  })
}