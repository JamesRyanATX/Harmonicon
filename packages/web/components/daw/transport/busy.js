import { LoadingBar } from '@composer/web-components';

import styles from '../../../styles/daw.transport.module.css';

function BusyLabel({ label }) {
  return (
    <div className={styles.busyLabel}>
      <h3>
        {label}
      </h3>
    </div>
  )
}

function BusyLoader({ label }) {
  return (
    <div className={styles.busyLoader}>
      <LoadingBar height={100} />
    </div>
  )
}

function BusyMask({ label }) {
  return (
    <div className={styles.busyMask}>
      {label}
    </div>
  )
}

export function Busy({
  label = 'Holup a sec'
}) {
  return (
    <div className={styles.busy}>
      <BusyLoader />
      <BusyMask />
      <BusyLabel label={label} />
    </div>
  )
}