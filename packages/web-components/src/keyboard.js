import React, { useState } from 'react';

import styles from '../styles/keyboard.module.css';

function Key({
  alias,
  octave,
  note,
  color,
  scale,
  playOnHover,
  onPlayNote,
}) {
  const [ pressed, setPressed ] = useState(false);
  const isTonic = scale.tonic === note || scale.tonic === alias;
  const isHighlighted = scale.type !== 'chromatic' && (
    scale.includes(note) || scale.includes(alias)
  );

  function press() {
    onPlayNote(`${note}${octave}`);
    setPressed(true)
  }

  function release() {
    setPressed(false)
  }

  function hover() {
    if (playOnHover) {
      press();
    }
  }

  return (
    <div
      onMouseEnter={hover}
      onMouseLeave={release}
      onMouseDown={press}
      onMouseUp={release}
      className={[
        styles.key,
        pressed ? styles.keyIsPressed : '',
        isHighlighted ? styles.keyIsHighlighted : '',
        isTonic ? styles.keyIsTonic : '',
        color === 'white' ? styles.keyIsWhite : styles.keyIsBlack,
      ].join(' ')}
    >
      <div />
      <label>
        {note}{octave}
      </label>
    </div>
  )
}

function Keys({
  color,
  children,
}) {
  return (
    <div
      className={[
        styles.keys,
        color === 'white' ? styles.keysAreWhite : styles.keysAreBlack,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function WhiteKey(props) {
  return (
    <Key color="white" {...props} />
  );
}

function BlackKey(props) {
  return (
    <Key color="black" {...props} />
  );
}

function WhiteKeys(props) {
  return (
    <Keys color="white">
      {[ 'B', 'A', 'G', 'F', 'E', 'D', 'C' ].map((note) => (
        <WhiteKey key={note} note={note} {...props} />
      ))}
    </Keys>
  );
}

function BlackKeys(props) {
  return (
    <Keys color="black">
      {[ 
        [ 'A#', 'Bb' ], 
        [ 'G#', 'Ab' ],
        [ 'F#', 'Gb' ], 
        [ 'D#', 'Eb' ],
        [ 'C#', 'Db' ],
      ].map((note) => {
        return (
          <BlackKey key={note[0]} note={note[0]} alias={note[1]} {...props} />
        );
      })}
    </Keys>
  );
}

function Octave(props) {
  return (
    <div className={styles.octave}>
      <WhiteKeys {...props} />
      <BlackKeys {...props} />
    </div>
  )
}

export function Keyboard({
  scale = null,
  onPlayNote = (note) => { console.log(note); }
}) {
  const [ pressed, setPressed ] = useState(false);

  function press() {
    setPressed(true);
  }

  function release() {
    setPressed(false);
  }

  return (
    <div
      onMouseDown={press}
      onMouseUp={release}
      onMouseLeave={release}
      className={styles.keyboard}
    >
      {[ 6, 5, 4, 3, 2, 1 ].map((octave) => (
        <Octave
          key={octave}
          octave={octave}
          scale={scale}
          playOnHover={pressed}
          onPlayNote={onPlayNote}
        />
      ))}
    </div>
  )
}