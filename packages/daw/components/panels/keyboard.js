import { useState, useEffect } from 'react';
import {
  Panel,
  PanelFilterRow,
  Keyboard,
  Select,
} from '@composer/daw-components';

import { whole } from '@composer/compose';
import { useController } from '../providers/controller';
import { Harmonicon, ScaleModel } from '@composer/core';


function InstrumentOptions({ session }) {
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
  const [ device, setDevice ] = useState(null);
  const [ tonic, setTonic ] = useState('C');
  const [ type, setType ] = useState('chromatic');
  const [ session, setSession ] = useState(null);
  const [ instrument, setInstrument ] = useState('core.instrument.piano');
  const controller = useController();

  function dumpSession (label) {
    console.log(`=== ${label} ===`);
    console.log(`device = ${device}`);
    console.log(`tonic = ${tonic}`);
    console.log(`type = ${type}`);
    console.log(`session = ${session}`);
    console.log(`instrument = ${instrument}`);
  }

  function assignDevice(newDevice) {
    setDevice(newDevice);
  }

  function releaseDevice() {
    setDevice(null);
  }

  function selectInstrument(instrument) {
    setInstrument(instrument);
  }

  function parsed(composer) {
    setSession(composer.model);
  }

  useEffect(() => {
    controller.on('midi:keyboard:assign', assignDevice);
    controller.on('midi:keyboard:release', releaseDevice);
    controller.on('composer:parsed', parsed);

    return () => {
      controller.off('midi:keyboard:assign', assignDevice);
      controller.off('midi:keyboard:release', releaseDevice);
      controller.off('composer:parsed', parsed);  
    }
  });

  const scale = ScaleModel.parse({ tonic, type });
  const label = `Keyboard ${device ? `(${device.name})` : ''}`;

  return (
    <Panel
      id="keyboard"
      label={label}
      flex={2}
      onClose={controller.toggleKeyboardPanel.bind(controller)}
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
            <Select label="Instrument" value={instrument} onChange={selectInstrument}>
              <InstrumentOptions session={session} />
            </Select>
          </PanelFilterRow>
        </>
      )}
    >
      <Keyboard 
        emitter={Harmonicon}
        scale={scale}
        device={device}
        instrument={instrument}
        onPlayNote={({ note }) => {
          console.log(`instrument = ${instrument}`);
          controller.playNote({
            note: whole.note(note),
            instrument
          });
        }}
      />
    </Panel>
  )
}