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

import { source as demoSource } from '../templates/demo';
import { source as blankSource } from '../templates/blank';


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
          blank: blankSource,
          demo: demoSource,
        },
        workspace: (await WorkspaceModel.loadOrCreate('default', properties, storageDriver))
          .setProperties(properties)
      }));
    })();
  }

  // Select a file
  if (!file && controller) {
    (async () => {
      const workspace = controller.workspace;

      if (workspace.files.length === 0) {
        await workspace.files.create({
          name: 'Demo',
          source: demoSource,
        });
      }

      const selectedFile = (() => {
        const selectedFileId = workspace.selectedFile;

        if (selectedFileId) {
          return workspace.files.filterByProperty('id', selectedFileId)[0];
        }
        else {
          return workspace.files.records[0];
        }
      })();

      setFile(await controller.selectFile(selectedFile));
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