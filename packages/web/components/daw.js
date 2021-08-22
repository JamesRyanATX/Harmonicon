import { useState } from 'react';
import { Switcher } from './daw/switcher';
import { Transport } from './daw/transport';
import { Editor } from './daw/editor';
import { Debugger } from './daw/debugger';
import { ToneAudioDriver, Tone } from '@composer/driver-audio-tone';
import { LocalStorageDriver } from '@composer/driver-storage-localstorage';
import { SessionComposer } from '@composer/compose';
import { Controller } from '../lib/daw/controller';

import styles from '../styles/daw.module.css';
import { WorkspaceModel } from '../../core/src/models/workspace';

const DEMO_FILE = `
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

const BLANK_FILE = `
session('Untitled', async ({ session }) => {

  // session.at.measure(0)
  //   .meter([ 4, 4 ])
  //   .tempo(120)

  // session.instrument(...
  // session.track(...

});
`.trim();

function Interface ({ children }) {
  return (
    <div className={styles.daw}>{children}</div>
  )
}

export function DAW ({
  audioDriverOptions = {},
  storageDriverOptions = {},
  logo = null,
}) {

  const [ loaded, setLoaded ] = useState(false);
  const [ audioDriver, setAudioDriver ] = useState();
  const [ storageDriver, setStorageDriver ] = useState();
  const [ controller, setController ] = useState();
  const [ file, setFile ] = useState();

  // console.log(`controller: ${!!controller}; audioDriver: ${!!audioDriver}; storageDriver: ${!!storageDriver}; loaded: ${!!loaded}`)

  // Initialize audio driver
  if (!audioDriver) {
    setAudioDriver(new ToneAudioDriver(audioDriverOptions));
  }

  // Initialize storage driver
  if (!storageDriver) {
    setStorageDriver(new LocalStorageDriver(storageDriverOptions));
  }

  // Initialize controller
  if (!controller && audioDriver && storageDriver) {
    (async () => {
      const properties = {
        audio: audioDriver,
        storage: storageDriver,
      }

      setController(new Controller({
        templates:{
          blank: BLANK_FILE,
          demo: DEMO_FILE,
        },
        workspace: (await WorkspaceModel.loadOrCreate('default', properties, storageDriver))
          .setProperties(properties)
      }));
    })();
  }

  // Select a file
  if (!file && controller) {
    (async () => {
      if (controller.workspace.files.length === 0) {
        await controller.workspace.files.create({
          name: 'Untitled',
          source: DEMO_FILE,
        });
      }
      else {
        setFile(await controller.selectFile(
          controller.workspace.files.records[0]
        ));
      }
    })();
  }

  // ...and we're off to the races!
  if (!loaded && file) {
    setLoaded(true);
  }

  // [TODO] eventually, this should not be necessary
  window.controller = controller;
  window.SessionComposer = SessionComposer;
  window.ToneAudioDriver = ToneAudioDriver;
  window.Tone = Tone; 

  if (loaded) {
    return (
      <Interface>
        <Switcher controller={controller} logo={logo} />
        <Editor controller={controller} />
        <Debugger controller={controller} />
        <Transport controller={controller} />
      </Interface>
    );
  }
  else {
    const Logo = logo;

    return (
      <Interface>
        <Logo size="large" />
      </Interface>
    )
  }
}