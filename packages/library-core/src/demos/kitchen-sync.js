export const kitchenSyncDemo = ({ library }) => {

  library.demo('Kitchen Sync', ({ demo }) => {
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

 session('demo', ({ session }) => {
   session.at(0)        // At measure zero...
     .meter([ 4, 4 ])   //   ...set the time signature to 4/4
     .tempo(160)        //   ...set the tempo to 160
     .swing(0)          //   ...set the swing factor to zero
     .key('d')          //   ...set tonic to "D"
     .scale('minor');   //   ...set scale to "minor", resulting in 
                        //      a key signature of "D minor"
 
 
   // Annotate specific positions on the timeline
   session.at(1).annotate('intro');              // intro measure 1
   session.at(9).annotate('verse-1a');           // verse 1a at measure 9
   session.at(17).annotate('verse-1a-midpoint'); // ...
   session.at(25).annotate('verse-1b');
 
   // Instruments
   // -----------
 
   session.use('core.instrument.drums', {
     volume: 0,
   });
 
   session.use('core.instrument.xylophone', {
     volume: -10
   });
 
   session.use('core.instrument.piano', {
     volume: -15
   });
 
   session.use('core.instrument.mono-synth', {
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
   }).as('bass');
 
   // Make a custom instrument with Tone.PluckSynth()
   session.instrument('lead', () => {
     return new Tone.PluckSynth({
       volume: -10
     });
   });
 
 
   // Reusable phrases (note sequences)
   // ---------------------------------
 
   session.phrase('beat-a', [
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     quarter.note('snare'),
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     eighth.note('snare'),
     eighth.note('kicklight'),
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     quarter.note('snare'),
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     eighth.note('snarerimshot'),
     eighth.note('kick'),
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     quarter.note('snare'),
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     eighth.note('snare'),
     eighth.note('kicklight'),
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     quarter.note('snare'),
 
     dotted.quarter.note('kick'),
     eighth.note('kick'),
     quarter.rest(),
     eighth.note('snarerimshot'),
     eighth.note([ 'kick', 'snarerimshot' ]),
 
   ]);
 
   session.phrase('bass-a', [
     eighth.note(-7),
     eighth.note(-6),
     eighth.note(-1),
     eighth.note(0),
     quarter.rest(),
     quarter.note(-7),
 
     dotted.quarter.note(-14),
     eighth.note(-14),
     half.rest(),
 
     dotted.quarter.note(-14),
     eighth.note(-14),
     half.rest(),
 
     dotted.quarter.note(-14),
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
 
     dotted.quarter.note(-14),
     eighth.note(-14),
     half.rest(),
 
     dotted.quarter.note(-14),
     eighth.note(-14),
     half.rest(),
 
     dotted.quarter.note(-14),
     eighth.note(-14),
     half.rest(),
   ]);
 
   session.phrase('piano-a', [
     whole.note('D3maj7'),
     whole.note('C3maj7'),
     whole.rest(),
     whole.rest(),
     whole.note('C3maj7'),
     whole.note('D3maj7'),
     whole.rest(),
     half.note('D3maj7'),
     half.note('F2maj7'),
 
     whole.note('E2min7'),
     whole.note('F2maj7'),
     whole.rest(),
     whole.rest(),
     whole.note('C3maj7'),
     whole.note('D3maj7'),
     whole.rest(),
     whole.note('F2maj#4'),
   ])
 
 
   // Tracks
   // ------
 
   session.track('drums', ({ track }) => {
     track.at('intro').play.phrase('beat-a');
     track.at('verse-1a').play.phrase('beat-a');
     track.at('verse-1a-midpoint').play.phrase('beat-a');
     track.at('verse-1b').play.phrase('beat-a');
   });
 
   session.track('bass', ({ track }) => {
     track.at('intro').play.phrase('bass-a');
     track.at('verse-1a').play.phrase('bass-a');
     track.at('verse-1a-midpoint').play.phrase('bass-a');
     track.at('verse-1b').play.phrase('bass-a');
   });
 
   session.track('lead', ({ track }) => {
     track.at('verse-1a').play.phrase('bass-a');
     track.at('verse-1a-midpoint').play.phrase('bass-a');
     track.at('verse-1b').play.phrase('bass-a');
   });
 
   session.track('xylophone', ({ track }) => {
     track.at('verse-1a').play.phrase('bass-a');
     track.at('verse-1a-midpoint').play.phrase('bass-a');
     track.at('verse-1b').play.phrase('bass-a');
   });
 
   session.track('piano', ({ track }) => {
     track.at('verse-1a').play.phrase('piano-a');
     track.at('verse-1b').play.phrase('piano-a');
   });
 
 
 
 
   // Effects
   // -------
 
   session.use('effect.delay', {
     delayTime: "8n",
     feedback: 0.2,
     wet: 0.2,
   }).as('fx-delay');
 
   session.use('effect.reverb', {
     wet: 0.2,
   }).as('fx-reverb');
 
 
   // Routing
   // -------
 
   // Create a master effect track
   session.track('fx')
 
   // Send instruments to their respective tracks
   session.send.instrument('drums').to.track('drums');
   session.send.instrument('bass').to.track('bass');
   session.send.instrument('lead').to.track('lead');
   session.send.instrument('xylophone').to.track('xylophone');
   session.send.instrument('piano').to.track('piano');
   session.send.instrument('arpeggiator').to.track('arpeggiator');
 
   // Send all tracks to the master effect track
   session.send.track('drums').to.track('fx');
   session.send.track('bass').to.track('fx');
   session.send.track('xylophone').to.track('fx');
   session.send.track('lead').to.track('fx');
   session.send.track('piano').to.track('fx');
   session.send.track('arpeggiator').to.track('fx');
 
   // Create effect chain and send it to main()
   session.send.track('fx').to.effect('fx-delay');
   session.send.effect('fx-delay').to.effect('fx-reverb');
   session.send.effect('fx-reverb').to.main();
 
 });

    `);
  })
}