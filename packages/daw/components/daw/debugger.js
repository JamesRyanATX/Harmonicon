import { useState } from 'react';

import styles from '../../styles/daw.debugger.module.css';

export function Debugger ({ controller }) {
  const [ loaded, setLoaded ] = useState(false);
  const [ error, setError ] = useState();

  if (!loaded) {
    controller.on('error', setError);
    setLoaded(true);
  }

  if (!error) {
    return '';
  }

  const details = error.error ? error.error.stack.split("\n") : [];

  return (
    <div
      className={styles.debugger}
      onClick={() => (setError())}
    >
      <div className={styles.debuggerSummary}>
        {error.message}
      </div>
      {details.length > 0 ? (
        <div className={styles.debuggerDetails}>
          {details.slice(1, 3).map((line, i) => {
            return (
              <div key={i}>{line}</div>
            );
          })}
        </div>
      ) : ''}
    </div>
  )
}