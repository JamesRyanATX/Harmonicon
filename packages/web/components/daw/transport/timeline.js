import { useState } from 'react';
import { useController } from '../providers/controller';
import { times } from '@composer/util';
import { PositionModel } from '@composer/core';

import styles from '../../../styles/daw.transport.module.css';


function positionToX(position, measureWidth, snapTo = 'beat') {
  const meter = position.meter || [ 4, 4 ];
  const measureX = position.measure * measureWidth;
  const beatX = (position.beat / meter[1]) * measureWidth;
  const subdivisionX = 0; // not supported

  const x = {
    measure: () => (measureX),
    beat: () => (measureX + beatX),
    subdivision: () => (measureX + beatX + subdivisionX),
  }[snapTo]();

  // console.log(`x = ${x}; measureX = ${measureX}; beatX = ${beatX}; subdivisionX = ${subdivisionX} (${position.toMBS()})`)

  return x;
}


function Measure({
  renderer = null,
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

function Measures({
  renderer,
  measureWidth = null,
  labelInterval = 10,
  length = 50
}) {
  return (
    <div className={styles.timelineMeasures}>
      {times(length, (i) => (
        <Measure
          key={i}
          measure={i}
          renderer={renderer}
          width={measureWidth}
          verbose={i % labelInterval === 0}
        />
      ))}
    </div>
  )
}

function CursorSelection({
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
  )
}

function CursorPointer({
  x = 0,
  active = false,
  color = '#ffffff',
  label = null,
  width = 2,
}) {
  return (
    <div
      className={styles.timelineCursorPosition}
      style={{
        left: `${x}px`,
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
  )
}

function Cursor({
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
    <div className={styles.timelineCursor}>
      <CursorSelection active={active} from={selectionFrom} to={selectionTo} />
      <CursorPointer active={active} x={x} label={format(x)} color={color} />
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
    </div>
  )
}

function TransportPositionCursor({
  active = true,
  position,
  measureWidth,
  color = 'var(--theme-primary-color)',
}) {
  return (
    <CursorPointer
      active={active}
      x={position ? positionToX(position, measureWidth) : 0}
      color={color}
      width={1}
    />
  )
}

function TransportPlayCursor({
  active = true,
  from = null,
  measureWidth,
  color = 'var(--theme-secondary-color)',
}) {
  return active ? (
    <CursorPointer
      active={true}
      x={(from.measure * measureWidth)}
      color={color}
      width={1}
    />
  ) : '';
}

function TransportInteractionCursor({
  onSelect,
  measureWidth,
  color = '#cccccc',
}) {
  return (
    <Cursor
      color={color}
      snapTo={measureWidth}
      onSelect={onSelect}
      snap
      interactive
    />
  )
}

function TransportLoopCursorSelection({
  active = false,
  from = null,
  to = null,
  measureWidth,
}) {
  return active ? (
    <CursorSelection
      active={active}
      from={from.measure * measureWidth}
      to={to.measure * measureWidth}
      color="var(--theme-tertiary-color)"
      backgroundColor="rgba(var(--theme-tertiary-color-dark-rgb), 0.25)"
      borderColor="var(--theme-tertiary-color-dark)"
    />
  ) : '';
}

export function Timeline ({
  measureWidth = 15,
  initialLength = 100,
  labelInterval = 10,
}) {
  const transport = useController().transport;
  
  const [ loaded, setLoaded ] = useState(false);
  const [ position, setPosition ] = useState(transport.position);
  const [ length, setLength ] = useState(initialLength);

  const [ loop, setLoop ] = useState(transport.loop);
  const [ loopFrom, setLoopFrom ] = useState(transport.loopFrom);
  const [ loopTo, setLoopTo ] = useState(transport.loopTo);

  const [ playFrom, setPlayFrom ] = useState(transport.playFrom);
  const [ playTo, setPlayTo ] = useState(transport.playTo);

  
  if (!loaded) {
    transport.on('changed:loop', ({ newValue }) => (setLoop(newValue)));
    transport.on('changed:loopFrom', ({ newValue }) => (setLoopFrom(newValue)));
    transport.on('changed:loopTo', ({ newValue }) => (setLoopTo(newValue)));
    transport.on('changed:playFrom', ({ newValue }) => (setPlayFrom(newValue)));
    transport.on('changed:playTo', ({ newValue }) => (setPlayTo(newValue)));
    transport.on('changed:position', ({ newValue }) => (setPosition(newValue)));

    setLoaded(true);
  }

  function onSelect(from, to) {
    const fromPosition = PositionModel.parse(Math.floor(from / measureWidth));
    const toPosition = PositionModel.parse(Math.floor(to / measureWidth));

    transport.setPosition(fromPosition);

    // Set new loop
    if (from !== to) {
      transport.setProperties({
        playFrom: fromPosition,
        playTo: toPosition,
        loopFrom: fromPosition,
        loopTo: toPosition,
        loop: true,
      })
    }

    // Adjust start position on existing loop
    else if (loop) {
      transport.setProperties({
        playFrom: fromPosition,
      });
    }
  }

  const showLoop = loop;
  const showPosition = transport.started || transport.paused;
  const showPlayFrom = true;
  const showInteraction = true;

  const common = { measureWidth }

  return (
    <div className={styles.timeline}>
      <Measures {...common}
        labelInterval={labelInterval}
        length={length}
      />
      <TransportLoopCursorSelection {...common}
        active={showLoop}
        from={loopFrom}
        to={loopTo}
      />
      <TransportPositionCursor {...common}
        active={showPosition}
        position={position}
      />
      <TransportPlayCursor {...common}
        active={showPlayFrom}
        from={playFrom}
        to={playTo}
      />
      <TransportInteractionCursor {...common}
        active={showInteraction}
        onSelect={onSelect}
      />
    </div>
  )
}
