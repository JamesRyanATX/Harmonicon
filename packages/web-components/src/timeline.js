import React, { useEffect, useState, useRef } from 'react';
import { times } from '@composer/util';

import styles from '../styles/timeline.module.css';

export function TimelineMeasure({
  measure = null,
  width = null,
  verbose = true,
  playStart = false,
  withinPlayLoop = false,
}) {
  return (
    <div
      className={[
        styles.timelineMeasure,
        verbose ? styles.timelineMeasureIsVerbose : '',
        playStart ? styles.timelineMeasureIsPlayStart : '',
        withinPlayLoop ? styles.timelineMeasureIsWithinPlayLoop : '',
      ].join(' ')}
      style={{ width: `${width}px` }}
    >
      <span>
        {verbose ? measure : ''}
      </span>
    </div>
  );
}

export function TimelineMeasuresLayer({
  renderer,
  measureWidth = null,
  labelInterval = 10,
  length = 50
}) {
  return (
    <TimelineLayer className={styles.timelineMeasuresLayer}>
      {times(length, (i) => (
        <TimelineMeasure
          key={i}
          measure={i}
          renderer={renderer}
          width={measureWidth}
          verbose={i % labelInterval === 0}
        />
      ))}
    </TimelineLayer>
  )
}

export function TimelineCursorSelectionLayer({
  from = null,
  to = null,
  backgroundColor = 'rgba(255, 255, 255, 0.15)',
  borderColor = 'rgba(255, 255, 255, 0.5)',
  borderWidth = 1,
}) {
  let left = 0;
  let width = 0;

  if (from < to) {
    left = from;
    width = to - from;
  }
  else if (from > to) {
    left = to;
    width = from - to;
  }

  return (
    <TimelineLayer>
      <div
        className={styles.timelineCursorSelection}
        style={{
          left: `${left}px`,
          width: `${width}px`,
          display: width === 0 ? 'none' : 'block',
          backgroundColor: `${backgroundColor}`,
          borderLeft: `${borderWidth}px solid ${borderColor}`,
          borderRight: `${borderWidth}px solid ${borderColor}`,
          borderTop: `${borderWidth}px solid ${borderColor}`,
          borderBottom: `${borderWidth}px solid ${borderColor}`,
        }} 
      />
    </TimelineLayer>
  )
}

export function TimelineCursorPointerLayer({
  x = 0,
  active = false,
  color = '#ffffff',
  label = null,
  width = 2,
}) {
  return (
    <TimelineLayer active={active}>
      <div
        className={styles.timelineCursorPosition}
        style={{
          left: `${x + 1}px`,
          backgroundColor: color,
          width: `${width}px`,
          color: color,
          display: active ? 'block' : 'none'
        }} 
      >
        <span>
          {label}
        </span>
      </div>
    </TimelineLayer>
  )
}

export function TimelineCursorLayer({
  color = '#ffffff',
  initialX = 0,
  snap = false,
  snapTo = 15,
  interactive = false,
  onSelect = () => {},
} = props = {}) {
  const [ x, setX ] = useState(initialX);
  const [ active, setActive ] = useState(!interactive);
  const [ selectionFrom, setSelectionFrom ] = useState(null);
  const [ selectionTo, setSelectionTo ] = useState(null);

  function cumulativeOffset(target) {
    const offsetParent = (target.offsetParent)
      ? cumulativeOffset(target.offsetParent)
      : { left: 0, top: 0 };

    return {
      left: target.offsetLeft + offsetParent.left,
      top: target.offsetTop + offsetParent.top
    };
  }

  function snapped(value) {
    if (snap) {
      return Math.floor(value / snapTo) * snapTo;
    }
    else {
      return value;
    }
  }

  function format(value) {
    const measure = Math.floor(value / snapTo);
    const beat = 0;

    return `${measure}:${beat}`;
  }

  function beginSelection() {
    setSelectionFrom(x);
    setSelectionTo(x);
  }

  function endSelection() {
    if (selectionFrom < selectionTo) {
      onSelect(selectionFrom, selectionTo);
    }
    else {
      onSelect(selectionTo, selectionFrom);
    }

    setSelectionFrom(null);
    setSelectionTo(null);
  }

  function onMouseMove(e) {
    const offset = cumulativeOffset(e.target);
    const x = snapped(e.clientX - offset.left);

    setX(x);

    if (selectionFrom) {
      setSelectionTo(x);
    }
  }

  function onMouseDown(e) {
    beginSelection();
  }

  function onMouseUp(e) {
    endSelection();
  }

  function onMouseEnter(e) {   
    setActive(true);
  }

  function onMouseLeave(e) { 
    setActive(false);
  }

  return (
    <TimelineLayer className={styles.timelineCursorLayer}>
      <TimelineCursorSelectionLayer active={active} from={selectionFrom} to={selectionTo} />
      <TimelineCursorPointerLayer active={active} x={x} label={format(x)} color={color} />
      {interactive ? (
        <div
          className={styles.timelineCursorMask}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}      
        />
      ) : ''}
    </TimelineLayer>
  )
}

export function TimelineWaveformLayer({
  waveform = [],
  color = 'rgb(60, 60, 60)',
  clipColor = 'rgb(150, 60, 60)',
  clipThreshold = 1,
  showClipping = true,
  opacity = 1,
  measureWidth = null,
  duration = null,
  unitsPerSecond = null,
}) {
  const canvasRef = useRef(null);
  const width = unitsPerSecond * duration;

  console.log(`width=${width} measureWidth=${measureWidth} samples=${waveform.length} duration=${duration} unitsPerSecond=${unitsPerSecond}`)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const height = canvas.height;

    // Overwrite existing render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const step = Math.ceil(waveform.length / width);
    const amp = height / 2;

    // console.log(`width=${width} step=${step}`);
    
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      let clipped = false;
        
      for (let j = 0; j < step; j++) {
        const datum = waveform[(i * step) + j];

        if (showClipping && (isNaN(datum) || Math.abs(datum) > clipThreshold)) {
          clipped = true;
        }

        datum = (isNaN(datum)) ? 0 : datum;
        datum = (datum > 1) ? 1 : datum;
        datum = (datum < -1) ? -1 : datum;

        if (datum < min) {
          min = datum;
        }
        if (datum > max) {
          max = datum;
        }
      }

      // console.log(`${i}: ${min}/${max} inRange=${inRange}`);

      ctx.fillStyle = (clipped) ? clipColor : color;
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  }, [ canvasRef, color, waveform, duration ]);

  return (
    <TimelineLayer opacity={opacity} className={styles.timelineWaveformLayer}>
      <canvas ref={canvasRef} style={{
        width: `${width}px`,
      }} />
    </TimelineLayer>
  )
}

export function TimelineLayer({
  children = null,
  opacity = 1,
  className = '',
} = props = {}) {
  return (
    <div className={[
      styles.timelineLayer,
      className
    ].join(' ')} style={{
      opacity,
    }}>
      {children}
    </div>
  )
}

export function Timeline({
  children = null
}) {
  return (
    <div className={styles.timeline}>
      {children}
    </div>
  )
}