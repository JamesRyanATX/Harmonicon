import { useState } from 'react';
import {
  Panel,
  Keyboard,
  Select,
} from '@composer/web-components';

import { whole } from '@composer/compose';
import { Harmonicon, ScaleModel } from '@composer/core';

export function KeyboardPanel({ controller }) {
  const [ tonic, setTonic ] = useState('C');
  const [ type, setType ] = useState('chromatic');

  const scale = ScaleModel.parse({ tonic, type });

  return (
    <Panel
      id="keyboard"
      label="Keyboard"
      flex={2}
      filter={() => (
        <>
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
        </>
      )}
    >
      <Keyboard 
        emitter={Harmonicon}
        scale={scale} onPlayNote={(note) => {
        controller.playNote({
          note: whole.note(note)
        });
      }} />
    </Panel>
  )
}