import { Actions } from './transport/actions';
import { Timeline } from './transport/timeline';
import { Display } from './transport/display';
import { Meter } from './transport/meter';
import { Busy } from './transport/busy';

import styles from '../../styles/daw.transport.module.css';
import { useState } from 'react';
import { useEventListener } from '@composer/web-components';
import { useTransport } from './providers/transport';

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
  const transport = useTransport();
  const [ busy, setBusy ] = useState(transport.busy);

  function onStateChange() {
    setBusy(transport.busy);
  }

  useEventListener(transport, 'changed:state', onStateChange);

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
      {busy ? <Busy /> : ''}
    </div>
  )
}