import { useState } from 'react';
import { Switcher } from './daw/switcher';
import { Transport } from './daw/transport';
import { Editor } from './daw/editor';
import { Debugger } from './daw/debugger';
import { ToneDriver, Tone } from '@composer/driver-tone';
import { SessionComposer } from '@composer/compose';
import { Controller } from '../lib/daw/controller';

import styles from '../styles/daw.module.css';

const DEFAULT_CODE = `
//
// [name] is a music-as-code DAW powered by your browser.
//

session('Example', async ({ session }) => {
  session.at.measure(0)   // At measure 0, do the following
    .meter([ 4, 4 ])      // 4/4 time
    .tempo(160)           // in beats per minute (bpm)
    .swing(0)             // 0 to 1
    .key('C')             // Root note of key (A, C, Db, F# etc.)
    .scale('major');      // Mode/scale (major, minor, ionian, dorian, etc.)

  session.instrument('bass', async () => {
    return new Tone.MembraneSynth().toDestination();
  });

  session.phrase('walk-the-relative-scale', ({ phrase }) => {
    phrase.steps(
      quarter.note(-14),    // Play a full octave in the selected mode and tonic
      eighth.note(-13),
      eighth.note(-12),
      eighth.note(-11),
      eighth.note(-10),
      eighth.note(-9),
      eighth.note(-8),
      eighth.note(-7),
    );
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(1).play.phrase('walk-the-relative-scale');
  });
});
`;

export function DAW (props) {
  const [ controller, setController ] = useState(new Controller({
    driver: new ToneDriver(),
    source: window.localStorage.source || DEFAULT_CODE
  }));

  // [TODO] eventually, this should not be necessary
  window.controller = controller;
  window.SessionComposer = SessionComposer;
  window.ToneDriver = ToneDriver;
  window.Tone = Tone; 

  return (
    <div className={styles.daw}>
      <Switcher controller={controller} />
      <Editor controller={controller} />
      <Debugger controller={controller} />
      <Transport controller={controller} />
    </div>
  )
}