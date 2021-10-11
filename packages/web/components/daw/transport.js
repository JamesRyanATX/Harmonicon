import { Actions } from './transport/actions';
import { Timeline } from './transport/timeline';
import { Display } from './transport/display';
import { Meter } from './transport/meter';

import styles from '../../styles/daw.transport.module.css';

function TransportGroup({
  flex = false,
  transparent = false,
  children = null,
}) {
  return (
    <div className={[
      styles.transportGroup,
      flex ? styles.transportGroupIsFlexed : '',
      transparent ? styles.transportGroupIsTransparent : '',
    ].join(' ')} >
      {children}
    </div>
  )
}

export function Transport ({ controller }) {
  return (
    <div className={styles.transport}>
      <TransportGroup>
        <Actions controller={controller} />
      </TransportGroup>
      <TransportGroup transparent>
        <Meter />
      </TransportGroup>
      <TransportGroup flex transparent>
        <Timeline controller={controller} />
      </TransportGroup>
      <TransportGroup>
        <Display controller={controller} />
      </TransportGroup>
    </div>
  )
}