export const relativesDemo = ({ library }) => {

  library.demo('Relative Pitches', ({ demo }) => {
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

session('relatives', ({ session }) => {
  session.at(0, 0, 0)
    .meter([ 4, 4 ])
    .tempo(120)
    .swing(0)
    .key('e')
    .scale('minor');

  // All notes (except percussion) are derivative of these 
  // pitches relative to the key signature declared above.
  const notes = [
    -7,
    -16,
    -12,
    -9,
    -10,
    -12,
    -13,
    -8
  ];

  session.use('instrument.trumpet', {
    volume: -15
  }).as('poly-synth');

  session.use('instrument.nylon-guitar', {
    volume: -15
  });

  session.use('instrument.cello', {
    volume: -15
  });

  session.use('instrument.fm-synth', {
    volume: -15
  });

  session.use('instrument.drums', {
    volume: -5
  });

  session.use('core.instrument.mono-synth', {
    volume: -8,
    detune: 0,
    portamento: 0.15,
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

  session.phrase('bass-a', [
    doubleWhole.note(notes[0] - 16),
    doubleWhole.note(notes[0] - 16),
    doubleWhole.note(notes[4] - 9),
    whole.note(notes[6] - 7),
    whole.note(notes[7] - 7),
  ]);

  session.track('bass', ({ track }) => {
    track.at(24).play.phrase('bass-a');
    track.at(32).play.phrase('bass-a');
  });

  session.track('am-synth', ({ track }) => {
    track.at(0).pan(1).volume(-10);
    track.at(0).play.phrase([
      doubleWhole.note(0),
      doubleWhole.note(4),
      doubleWhole.note(3),
      doubleWhole.note(1),

      doubleWhole.note(0),
      doubleWhole.note(4),
      doubleWhole.note(-4),
      whole.note(1),
      quarter.note(1),
      quarter.note(2),
      quarter.note(3),
      quarter.note(4),

      doubleWhole.note(0),
      doubleWhole.note(4),
      doubleWhole.note(3),
      doubleWhole.note(1),

      doubleWhole.note(0),
      doubleWhole.note(4),
      doubleWhole.note(-4),
      whole.note(1),
      quarter.note(1),
      quarter.note(2),
      quarter.note(3),
      quarter.note(4),
    ]);
  }).as('fm-synth');

  session.track('poly-synth', ({ track }) => {
    track.at(0).pan(1);
    track.at(0).play.phrase(notes.map((note) => {
      return whole.note(note + 2);
    }));
    track.at(8).play.phrase(notes.map((note) => {
      return whole.note(note + 5);
    }));
    track.at(16).play.phrase(notes.map((note) => {
      return whole.note(note + 5);
    }));
    track.at(24).play.phrase(notes.map((note) => {
      return whole.note(note + 2);
    }));
    track.at(32).play.phrase(notes.map((note) => {
      return whole.note(note + 2);
    }));
  });

  session.track('nylon-guitar', ({ track }) => {
    track.at(0).pan(-1);
    track.at(0).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(8).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(16).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(24).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(32).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
  });

  session.track('cello', ({ track }) => {
    track.at(0).pan(-0.5);
    track.at(0).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(8).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(16).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(24).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
    track.at(32).play.phrase(notes.map((note) => {
      return whole.note(note);
    }));
  });

  session.phrase('beat-a', [
    eighth.note('kick snarerimshot sidestick'),
    eighth.note('kick'),
    eighth.note('kick sidestick'),
    eighth.note('kick snarerimshot2'),
    eighth.note('kick sidestick'),
    eighth.note('kicklight'),
    eighth.note('kick snarerimshot sidestick'),
    eighth.note('kick'),

    eighth.note('kick snarerimshot sidestick'),
    eighth.note('kick'),
    eighth.note('kick sidestick'),
    eighth.note('kick snarerimshot2'),
    eighth.note('kick sidestick'),
    eighth.note('kicklight'),
    sixteenth.note('kick snarerimshot sidestick'),
    sixteenth.note('snarerimshot'),
    sixteenth.note('snare'),
    sixteenth.note('snare'),
  ]);

  session.track('drums', ({ track }) => {
    track.at(8).play.phrase('beat-a');
    track.at(10).play.phrase('beat-a');
    track.at(12).play.phrase('beat-a');
    track.at(14).play.phrase('beat-a');
    track.at(16).play.phrase('beat-a');
    track.at(18).play.phrase('beat-a');
    track.at(20).play.phrase('beat-a');
    track.at(22).play.phrase('beat-a');

    track.at(32).play.phrase('beat-a');
    track.at(34).play.phrase('beat-a');
    track.at(36).play.phrase('beat-a');
    track.at(38).play.phrase('beat-a');
    track.at(40).play.phrase('beat-a');
    track.at(42).play.phrase('beat-a');
  });

  session.use('core.effect.reverb', {
    wet: 0.75,
    decay: 1,
  });

  session.use('core.effect.delay', {
    delayTime: "8n",
    feedback: 0.6,
    wet: 0.2,
  });

  session.track('fx');

  session.send.instrument('bass').to.track('bass');
  session.send.instrument('cello').to.track('cello');
  session.send.instrument('drums').to.track('drums');
  session.send.instrument('poly-synth').to.track('poly-synth');
  session.send.instrument('fm-synth').to.track('fm-synth');
  session.send.instrument('nylon-guitar').to.track('nylon-guitar');

  session.send.track('bass').to.main();
  session.send.track('cello').to.track('fx');
  session.send.track('drums').to.track('fx');
  session.send.track('poly-synth').to.track('fx');
  session.send.track('fm-synth').to.track('fx');
  session.send.track('nylon-guitar').to.track('fx');

  session.send.track('fx').to.effect('delay');
  session.send.effect('delay').to.effect('reverb');
  session.send.effect('reverb').to.main();

});

    `.trim());
  })
}