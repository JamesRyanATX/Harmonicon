import { useState } from 'react'

import styles from '../../../styles/daw.transport.module.css';

export function Display ({ controller }) {
  const [ display, setDisplay ] = useState({
    measure: 0,
    beat: 0,
    subdivision: 0,
  });

  controller.registerPositionListener(setDisplay);

  return (
    <div className={styles.display}>
      {display.measure}:{display.beat}:{display.subdivision}
    </div>
  )
}
