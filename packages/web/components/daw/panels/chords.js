import { ChordModel } from '@composer/core';
import { whole } from '@composer/compose';
import { useState } from 'react';

import {
  Panel,
  Tree,
  TreeGroup,
  TreeItem,
  Select,
} from '@composer/web-components';

import { IoVolumeHighSharp, IoCodeSharp } from 'react-icons/io5';
import { CgPiano } from 'react-icons/cg';

const notes = [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G#' ];
const octaves = [ 1, 2, 3, 4, 5, 6 ];

const ChordTemplate = ({ symbol, octave }) => {
  return `quarter.note('*${symbol}', { octave: ${octave} })`;
};

function Chords({
  chords = [],
  root,
  tonic,
  octave,
  icon = CgPiano,
  onCopy = () => {},
  onPlay = () => {},
}) {
  return (
    <>
      {chords.map((chord) => {
        return (
          <TreeItem 
            key={chord.symbol}
            label={chord.symbol}
            icon={icon}
            actions={() => {
              const actionParams = { root, tonic, octave, symbol: chord.symbol };

              return (
                <>
                  <a onClick={() => (onCopy(actionParams))} title="Copy to clipboard">
                    <IoCodeSharp />
                  </a>
                  <a onClick={() => (onPlay(actionParams))} title="Play chord">
                    <IoVolumeHighSharp />
                  </a>
                </>
              );
            }}
          />
        )
      })}
    </>
  );
}

export function ChordsPanel({ controller }) {
  const [ root, setRoot ] = useState('C');
  const [ tonic, setTonic ] = useState('C');
  const [ octave, setOctave ] = useState(4);

  const chords = root ? ChordModel.chordsFor({ 
    root: `${root}${octave}`,
    tonic: tonic || root,
  }) : [];

  return (
    <Panel
      id="chords"
      label="Chord Browser"
      flex={1}
      filter={() => (
        <>
          <Select label="Root" value={root} onChange={setRoot} span={1}>
            {notes.map((note) => (
              <option key={note}>{note}</option>
            ))}
          </Select>
          <Select label="Tonic" value={tonic} onChange={setTonic} span={1}>
            {notes.map((note) => (
              <option key={note}>{note}</option>
            ))}
          </Select>
          <Select label="Oct" value={octave} onChange={setOctave} span={1}>
            {octaves.map((octave) => (
              <option key={octave}>{octave}</option>
            ))}
          </Select>
        </>
      )}
    >
      <Tree>
        <Chords
          key={root}
          root={root}
          tonic={tonic}
          octave={octave}
          chords={chords}
          onCopy={(record) => {
            navigator.clipboard.writeText(ChordTemplate(record));
          }}
          onPlay={({ symbol, root, tonic, octave }) => {
            controller.playNote({
              note: whole.note(`*${symbol}`, { octave })
            });
          }}
        />
      </Tree>
    </Panel>
  )
}