import { useState } from 'react';
import styles from '../../../styles/daw.transport.module.css';
import { useTransport } from '../providers/transport';

function Channels({
  children = null,
}) {
  return (
    <div className={styles.meterChannels}>{children}</div>
  )
}

function Channel({
  min = -50,
  max = 12,
  level = -5,
  peak = 0,
  threshold = -50,
}) {
  function pct(value) {
    const level = value < min ? min : value;
    const range = Math.abs(max - min);

    return Math.abs(level - min) / range;
  }

  const levelPct = pct(level);
  const peakLevelPct = pct(peak);

  return (
    <div className={styles.meterChannel}>
      <div className={styles.meterChannelPeak} style={{ 
        display: peak > threshold ? 'block' : 'none',
        height: `${peakLevelPct * 100}%` }}></div>
      <div className={styles.meterChannelLevel} style={{
        height: `${levelPct * 100}%`
      }}></div>
    </div>
  )
}

export function Meter () {
  const transport = useTransport();
  const [ loaded, setLoaded ] = useState(false);
  const [ leftLevel, setLeftLevel ] = useState(-500);
  const [ leftLevelPeak, setLeftLevelPeak ] = useState(-500);
  const [ rightLevel, setRightLevel ] = useState(-500);
  const [ rightLevelPeak, setRightLevelPeak ] = useState(-500);


  function resetLevels() {
    setLeftLevel(-500);
    setRightLevel(-500);
  }

  function resetPeaks() {
    setLeftLevelPeak(-500);
    setRightLevelPeak(-500);
  }

  function reset() {
    resetLevels();
    resetPeaks();
  }

  if (!loaded) {

    // Reset meter if nothing is playing
    transport.on('changed:state', () => {
      if (transport.state !== 'started') {
        resetLevels();
      }
    })

    transport.on('changed:position', () => {
      if (transport.renderer && transport.started) {
        const current = transport.renderer.getNode('meter', 'main').getValue();

        setLeftLevel(current[0]);
        setRightLevel(current[0]);
      }
    });

    setLoaded(true);
  }

  if (leftLevel > leftLevelPeak) {
    setLeftLevelPeak(leftLevel);
  }

  if (rightLevel > rightLevelPeak) {
    setRightLevelPeak(rightLevel);
  }

  return (
    <div className={styles.meter} onClick={reset}>
      <Channels label="Main">
        <Channel level={leftLevel} peak={leftLevelPeak} />
        <Channel level={rightLevel} peak={rightLevelPeak} />
      </Channels>
    </div>
  )
}
