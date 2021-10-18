import { useState } from 'react';

import { SessionComposer } from '@composer/compose';
import { Harmonicon } from '@composer/core';
import * as ToneAudioDriver from '@composer/driver-audio-tone';
import * as LocalStorageDriver from '@composer/driver-storage-localstorage';
import * as WebMidiDriver from '@composer/driver-midi-web';
import * as CoreLibrary from '@composer/library-core';

import { Controller } from '../lib/daw/controller';
import { ControllerProvider } from './daw/providers/controller';
import { WorkspaceProvider } from './daw/providers/workspace';
import { LoggerProvider } from './daw/providers/logger';
import { Interface } from './daw/interface';

export function DAW ({
  audioDriverOptions = {},
  storageDriverOptions = {},
  midiDriverOptions = {},
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
    <LoggerProvider>
      <ControllerProvider controller={controller}>
        <WorkspaceProvider workspace={workspace}>
          <Interface />
        </WorkspaceProvider>
      </ControllerProvider>
    </LoggerProvider>
  ) : '';
}