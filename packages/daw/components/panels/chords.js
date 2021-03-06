import { ChordModel } from '@composer/core';
import { whole } from '@composer/compose';
import { useState } from 'react';

import {
  IconButton,
  Panel,
  PanelFilterRow,
  Tree,
  TreeItem,
  Select,
} from '@composer/daw-components';

import {
  IoVolumeHighSharp,
  IoCodeSharp, 
  IoLockClosedOutline,
  IoLockClosedSharp,
} from 'react-icons/io5';
import { CgPiano } from 'react-icons/cg';

const notes = [ 'A', 'Ab', 'A#', 'B', 'Bb', 'C', 'C#', 'D', 'Db', 'D#', 'E', 'Eb', 'F', 'F#', 'G', 'Gb', 'G#' ];
const octaves = [ 1, 2, 3, 4, 5, 6 ];
const qualities = [
  'Augmented',
  'Diminished',
  'Major',
  'Minor',
  'Unknown'
]

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
        const actionParams = { root, tonic, octave, symbol: chord.symbol };

        return (
          <TreeItem 
            key={chord.symbol}
            label={chord.name}
            description={chord.notes.join(' ')}
            icon={icon}
            onClick={() => (onPlay(actionParams))}
            actions={() => {
              return (
                <>
                  <a onClick={() => (onPlay(actionParams))} title="Play chord">
                    <IoVolumeHighSharp />
                  </a>
                  <a onClick={() => (onCopy(actionParams))} title="Copy to clipboard">
                    <IoCodeSharp />
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

export function ChordsPanel() {
  const [ root, setRoot ] = useState('C');
  const [ tonic, setTonic ] = useState('C');
  const [ lock, setLock ] = useState(true);
  const [ octave, setOctave ] = useState(4);
  const [ quality, setQuality ] = useState('Major');

  const chords = root ? ChordModel.chordsFor({ 
    root: `${root}${octave}`,
    tonic: tonic || root,
    quality
  }) : [];

  function selectRoot(value) {
    setRoot(value);

    if (lock) {
      setTonic(value);
    }
  }

  function selectTonic(value) {
    setTonic(value);

    if (lock) {
      setRoot(value);
    }
  }

  return (
    <Panel
      id="chords"
      label="Chord Browser"
      flex={1}
      onClose={controller.toggleChordsPanel.bind(controller)}
      filter={() => (
        <>
          <PanelFilterRow>
            <Select label="Root" value={root} onChange={selectRoot} span={1}>
              {notes.map((note) => (
                <option key={note}>{note}</option>
              ))}
            </Select>
            <IconButton
              icon={lock ? IoLockClosedSharp : IoLockClosedOutline}
              color={lock ? 'var(--theme-palette-yellow)' : undefined}
              onClick={() => (setLock(!lock))}
            />
            <Select label="Tonic" value={tonic} onChange={selectTonic} span={1}>
              {notes.map((note) => (
                <option key={note}>{note}</option>
              ))}
            </Select>
          </PanelFilterRow>
          <PanelFilterRow>
            <Select label="Octave" value={octave} onChange={setOctave} span={1}>
              {octaves.map((octave) => (
                <option key={octave}>{octave}</option>
              ))}
            </Select>
          </PanelFilterRow>
          <PanelFilterRow>
            <Select label="Quality" value={quality} onChange={setQuality} span={1}>
              {qualities.map((quality) => (
                <option key={quality}>{quality}</option>
              ))}
            </Select>
          </PanelFilterRow>
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
              note: whole.note(`*${symbol}`, { octave }),
              instrument: 'core.instrument.piano'
            });
          }}
        />
      </Tree>
    </Panel>
  )
}