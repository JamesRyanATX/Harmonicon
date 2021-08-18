import { useState } from 'react';
import { Switcher } from './daw/switcher';
import { Transport } from './daw/transport';
import { Editor } from './daw/editor';
import { Debugger } from './daw/debugger';
import { ToneDriver, Tone } from '@composer/driver-tone';
import { SessionComposer } from '@composer/compose';
import { Controller } from '../lib/daw/controller';

import styles from '../styles/daw.module.css';
import { WorkspaceModel } from '../../core/src/models/workspace';

// const DEFAULT_CODE = `
// //
// // [name] is a music-as-code DAW powered by your browser.
// //

// session('Example', async ({ session }) => {
//   session.at.measure(0)   // At measure 0, do the following
//     .meter([ 4, 4 ])      // 4/4 time
//     .tempo(160)           // in beats per minute (bpm)
//     .swing(0)             // 0 to 1
//     .key('C')             // Root note of key (A, C, Db, F# etc.)
//     .scale('major');      // Mode/scale (major, minor, ionian, dorian, etc.)

//   session.instrument('bass', async () => {
//     return new Tone.MembraneSynth().toDestination();
//   });

//   session.phrase('walk-the-relative-scale', ({ phrase }) => {
//     phrase.steps(
//       quarter.note(-14),    // Play a full octave in the selected mode and tonic
//       eighth.note(-13),
//       eighth.note(-12),
//       eighth.note(-11),
//       eighth.note(-10),
//       eighth.note(-9),
//       eighth.note(-8),
//       eighth.note(-7),
//     );
//   });

//   session.track('bass', async ({ track }) => {
//     track.at.measure(1).play.phrase('walk-the-relative-scale');
//   });
// });
// `;

function Interface ({ children }) {
  return (
    <div className={styles.daw}>{children}</div>
  )
}

export function DAW ({
  audioDriverOptions = {},
  storageDriverOptions = {},
  workspaceOptions = {}
}) {

  const [ loaded, setLoaded ] = useState(false);
  const [ audioDriver, setAudioDriver ] = useState();
  const [ storageDriver, setStorageDriver ] = useState();
  const [ controller, setController ] = useState();

  // Initialize audio driver
  if (!audioDriver) {
    setAudioDriver(new ToneDriver(audioDriverOptions));
  }

  // Initialize storage driver
  if (!storageDriver) {
    setStorageDriver(new LocalStorageDriver(storageDriverOptions));
  }

  // Initialize controller
  if (!controller && audioDriver && storageDriver) {
    setController(new Controller({
      workspace: WorkspaceModel.parse(Object.assign({
        audio: audioDriver,
        storage: storageDriver,
      }, workspaceOptions))
    }));
  }

  // ...and we're off to the races!
  if (controller) {
    setLoaded(true);
  }

  // [TODO] eventually, this should not be necessary
  window.controller = controller;
  window.SessionComposer = SessionComposer;
  window.ToneDriver = ToneDriver;
  window.Tone = Tone; 

  if (loaded) {
    return (
      <Interface>
        <Switcher controller={controller} />
        <Editor controller={controller} />
        <Debugger controller={controller} />
        <Transport controller={controller} />
      </Interface>
    );
  }
  else {
    return (
      <Interface>
        loading...
      </Interface>
    )
  }
}