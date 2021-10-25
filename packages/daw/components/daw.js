import { useState } from 'react';

import { SessionComposer } from '@composer/compose';
import { Harmonicon } from '@composer/core';
import * as ToneAudioDriver from '@composer/driver-audio-tone';
import * as LocalStorageDriver from '@composer/driver-storage-localstorage';
import * as DropboxStorageDriver from '@composer/driver-storage-dropbox';
import * as WebMidiDriver from '@composer/driver-midi-web';
import * as CoreLibrary from '@composer/library-core';

import { Controller } from '../lib/controller';
import { ControllerProvider } from './providers/controller';
import { WorkspaceProvider } from './providers/workspace';
import { LoggerProvider } from './providers/logger';
import { Interface } from './interface';


function getStorageDriver(options) {
  if (localStorage['harmonicon.storage'] === 'dropbox') {
    return new DropboxStorageDriver.Driver({
      accessToken: localStorage['harmonicon.dropbox.accessToken'],
      ...options
    })
  }
  else {
    return new LocalStorageDriver.Driver(options);
  }
}

function getAudioDriver(options) {
  return new ToneAudioDriver.Driver(options);
}

function getMidiDriver(options) {
  return new WebMidiDriver.Driver(options);
}

function getDrivers({
  storage, audio, midi
}) {
  return {
    storage: getStorageDriver(storage),
    audio: getAudioDriver(audio),
    midi: getMidiDriver(midi),
  }
}

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
      const drivers = getDrivers({
        storage: storageDriverOptions,
        audio: audioDriverOptions,
        midi: midiDriverOptions,
      });

      const workspace = await Harmonicon.initialize({
        drivers, libraries: [ CoreLibrary ],
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