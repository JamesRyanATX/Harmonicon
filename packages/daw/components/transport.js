import { useState, useEffect } from 'react';
import { useEventListener } from '@composer/daw-components';

import { Actions } from './transport/actions';
import { Timeline } from './transport/timeline';
import { Display } from './transport/display';
import { Meter } from './transport/meter';
import { Busy } from './transport/busy';
import { renderWaveformTask } from '../lib/tasks/render_waveform';
import { useTransport } from './providers/transport';
import { useController } from './providers/controller';

import styles from '../styles/daw.transport.module.css';
import { useViewport } from '@composer/daw-components/src/hooks';

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

export function Transport () {
  const transport = useTransport();
  const controller = useController();
  const viewport = useViewport();

  const [ busy, setBusy ] = useState(transport.busy);

  function onStateChange() {
    setBusy(transport.busy);
  }

  function renderWaveform() {
    // transport.blockWhile(renderWaveformTask({ controller }));
  }

  function resetTransport() {
    transport.reset();
  }

  useEventListener(transport, 'changed:state', onStateChange);

  // Re-render when tab/file is selected
  useEventListener(controller, 'file:selected', renderWaveform);
  useEventListener(controller, 'file:selected', resetTransport);

  // Initial render
  useEffect(renderWaveform, []);

  // Mobile rendering
  if (viewport.width < 800) {
    return (
      <>
        <div className={styles.transport}>
          <TransportGroup transparent>
            <Meter />
          </TransportGroup>
          <TransportGroup flex transparent>
            <Timeline controller={controller} />
          </TransportGroup>
          {busy ? <Busy /> : ''}
        </div>
        <div className={styles.transport}>
          <TransportGroup>
            <Actions controller={controller} />
          </TransportGroup>
          <TransportGroup flex>
            <Display controller={controller} />
          </TransportGroup>
          {busy ? <Busy /> : ''}
        </div>
      </>
    );
  }

  // Desktop rendering
  else {
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
    );
  }
}