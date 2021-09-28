import { useState } from 'react';
import {
  Panel,
  PanelFilterRow,
  Keyboard,
  Select,
} from '@composer/web-components';

import { whole } from '@composer/compose';
import { useController } from '../providers/controller';
import { Harmonicon, ScaleModel } from '@composer/core';


function InstrumentOptions({ session }) {
  const controller = useController();

  return (
    <>
      {Object.keys(Harmonicon.libraries).sort().map((libraryName) => {
        const library = Harmonicon.libraries[libraryName];

        return (
          <optgroup key={library.name} label={library.name}>
            {library.instruments.map((instrument) => {
              return (
                <option key={instrument.name} value={`${libraryName}.instrument.${instrument.name}`}>{instrument.name}</option>
              );
            })}
          </optgroup>
        )
      })}
      {session ? (
        <optgroup label={controller.file.name}>
          {session.instruments.map((instrument) => (
            <option key={instrument.name}>{instrument.name}</option>
          ))}
        </optgroup>
      ) : ''}
    </>
  )
}

export function KeyboardPanel() {
  const [ loaded, setLoaded ] = useState(false);
  const [ tonic, setTonic ] = useState('C');
  const [ type, setType ] = useState('chromatic');
  const [ session, setSession ] = useState(null);
  const [ instrument, setInstrument ] = useState('core.instrument.piano');
  const controller = useController();

  function parsed(composer) {
    setSession(composer.model);
  }

  if (!loaded) {
    controller.on('composer:parsed', parsed);
  }

  const scale = ScaleModel.parse({ tonic, type });

  return (
    <Panel
      id="keyboard"
      label="Keyboard"
      flex={2}
      filter={() => (
        <>
          <PanelFilterRow>
            <Select label="Tonic" value={tonic} onChange={setTonic} span={1}>
              {[ 
                'A',
                'Ab',
                'A#',
                'B',
                'Bb',
                'C',
                'C#',
                'D',
                'Db',
                'D#',
                'E',
                'Eb',
                'F',
                'F#',
                'G',
                'Gb',
                'G#',
              ].map((note) => (
                <option key={note}>{note}</option>
              ))}
            </Select>
            <Select label="Scale" value={type} onChange={setType} span={2}>
              {ScaleModel.all.map((note) => (
                <option key={note}>{note}</option>
              ))}
            </Select>
          </PanelFilterRow>
          <PanelFilterRow>
            <Select label="Instrument" value={instrument} onChange={setInstrument}>
              <InstrumentOptions session={session} />
            </Select>
          </PanelFilterRow>
        </>
      )}
    >
      <Keyboard 
        emitter={Harmonicon}
        scale={scale} onPlayNote={(note) => {
        controller.playNote({
          note: whole.note(note),
          instrument
        });
      }} />
    </Panel>
  )
}