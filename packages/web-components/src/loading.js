import React from 'react';
import styles from '../styles/loading.module.css';

export function LoadingBar({
  height = '10px',
  percentComplete = 1,
}) {
  return (
    <div
      className={styles.loadingBar}
      style={{ 
        height,
      }}
    >
      <div style={{ width: `${(1 - percentComplete) * 100}%` }} />
    </div>
  )
}