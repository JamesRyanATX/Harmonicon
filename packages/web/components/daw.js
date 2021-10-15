import { useState } from 'react';

import { SessionComposer } from '@composer/compose';
import { Harmonicon } from '@composer/core';

import * as ToneAudioDriver from '@composer/driver-audio-tone';
import * as LocalStorageDriver from '@composer/driver-storage-localstorage';
import * as WebMidiDriver from '@composer/driver-midi-web';
import * as CoreLibrary from '@composer/library-core';

import { Controller } from '../lib/daw/controller';
import { ControllerContext } from './daw/providers/controller';

import { Workspace } from './daw/workspace';
import { Interface } from './daw/interface';

export function DAW ({
  audioDriverOptions = {},
  storageDriverOptions = {},
  midiDriverOptions = {},
  logo = null,
}) {
  const [ loaded, setLoaded ] = useState(false);
  const [ controller, setController ] = useState();
  const [ workspace, setWorkspace ] = useState();

  // Initialize controller
  if (!controller && !workspace) {
    (async () => {
      const workspace = await Harmonicon.initialize({
        libraries: [ CoreLibrary ],
        drivers: {
          storage: new LocalStorageDriver.Driver(storageDriverOptions),
          audio: new ToneAudioDriver.Driver(audioDriverOptions),
          midi: new WebMidiDriver.Driver(midiDriverOptions)
        }
      });

      const controller = new Controller({ workspace });

      setWorkspace(workspace);
      setController(controller);
      setLoaded(true);
    })();
  }

  // [TODO] eventually, this should not be necessary
  window.controller = controller;
  window.SessionComposer = SessionComposer;
  window.ToneAudioDriver = ToneAudioDriver;
  window.Tone = ToneAudioDriver.Tone; 

  return loaded ? (
    <ControllerContext.Provider value={controller}>
      <Workspace workspace={controller.workspace}>
        <Interface logo={logo} />
      </Workspace>
    </ControllerContext.Provider>
  ) : '';
}