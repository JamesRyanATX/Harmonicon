import { useState } from 'react';

import { SessionComposer } from '@composer/compose';
import { Harmonicon } from '@composer/core';

import * as ToneAudioDriver from '@composer/driver-audio-tone';
import * as LocalStorageDriver from '@composer/driver-storage-localstorage';
import * as CoreLibrary from '@composer/library-core';

import { Controller } from '../lib/daw/controller';
import { ControllerContext } from './daw/providers/controller';
import { Interface } from './daw/interface';


export function DAW ({
  audioDriverOptions = {},
  storageDriverOptions = {},
  logo = null,
}) {

  const [ loaded, setLoaded ] = useState(false);
  const [ controller, setController ] = useState();
  const [ file, setFile ] = useState();

  // Initialize controller
  if (!controller) {
    (async () => {
      const workspace = await Harmonicon.initialize({
        libraries: [ CoreLibrary ],
        drivers: {
          storage: new LocalStorageDriver.Driver(storageDriverOptions),
          audio: new ToneAudioDriver.Driver(audioDriverOptions)
        }
      });

      setController(new Controller({ workspace }));
    })();
  }

  // Select a file
  if (!file && controller) {
    (async () => {
      const workspace = controller.workspace;

      if (workspace.files.length === 0) {
        await workspace.files.create({
          name: 'Demo',
          source: Harmonicon.libraries.core.demos.filterByProperty('name', 'Kitchen Sync')[0].source,
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
  window.Tone = ToneAudioDriver.Tone; 

  if (loaded) {
    return (
      <ControllerContext.Provider value={controller}>
        <Interface logo={logo} />
      </ControllerContext.Provider>
    );
  }
  else {
    const Logo = logo;

    return (
      <Logo size="large" />
    )
  }
}