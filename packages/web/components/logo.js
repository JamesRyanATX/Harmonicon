import { useState, useEffect } from 'react';
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
  size = 'large',
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
    <Shape letter="O" key="o" />,
    'n'
  ]
}) {
  const [ offset, setOffset ] = useState(0);

  useEffect(() => {
    let timer;

    (function updateOffset () {
      if (animate) {
        setOffset(offset + 1);
      }

      timer = setTimeout(updateOffset, speed * 1000);
    })();
    
    return () => {
      clearTimeout(timer);
    }
  }, []);

  return (
    <div className={[
      styles.logo,
      size === 'small' ? styles.logoIsSmall : '',
      size === 'large' ? styles.logoIsLarge : '',
    ].join(' ')}>
      {letters.map((letter, i) => (
        <Letter key={i} index={(i + offset) % 10}>{letter}</Letter>
      ))}
    </div>
  )
}