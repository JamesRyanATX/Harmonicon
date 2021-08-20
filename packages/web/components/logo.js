import { useState } from 'react';
import styles from '../styles/logo.module.css';

function Letter ({ children, index }) {
  return (
    <div className={styles.letter} data-index={index}>
      {children}
    </div>
  )
}

function Shape({ letter }) {
  return (
    <div className={[
      styles.shape,
      styles[`shape${letter}`]
    ].join(' ')}>
      <div className={styles.shape}></div>
      <div className={styles.shape}></div>
    </div>
  )
}

export function Logo ({
  speed = 5,
  animate = true,
  letters = [ 
    'h',
    'a',
    'r',
    'm',
    'o',
    'n', 
    'i',
    'c',
    <Shape letter="O" />,
    'n'
  ]
}) {
  const [ offset, setOffset ] = useState(0);

  if (animate) {
    setTimeout(() => {
      setOffset(offset + 1);
    }, speed * 1000);  
  }

  return (
    <div className={styles.logo}>
      {letters.map((letter, i) => (
        <Letter index={(i + offset) % 10}>{letter}</Letter>
      ))}
    </div>
  )
}