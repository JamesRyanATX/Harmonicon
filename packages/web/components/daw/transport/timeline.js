import { useState, useEffect } from 'react';
import { useController } from '../providers/controller';
import { useFile } from '../providers/file';
import { PositionModel } from '@composer/core';
import {
  Timeline as WebComponentsTimeline,
  TimelineCursorLayer,
  TimelineCursorPointerLayer,
  TimelineCursorSelectionLayer,
  TimelineMeasuresLayer,
  TimelineWaveformLayer,
} from '@composer/web-components';


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

function TransportWaveform({
  measureWidth = null,
  unitsPerSecond = null,
}) {
  const file = useFile();

  const [ waveform, setWaveform ] = useState(file.waveform || []);
  const [ duration, setDuration ] = useState(file.duration || 0);

  function updateWaveform({ newValue }) {
    setWaveform(newValue);
  }

  function updateDuration({ newValue }) {
    setDuration(newValue);
  }

  useEffect(() => {
    setWaveform(file.waveform || []);
    setDuration(file.duration || 0);

    file.on('changed:waveform', updateWaveform);
    file.on('changed:duration', updateDuration);

    return () => {
      file.off('changed:waveform', updateWaveform);
      file.off('changed:duration', updateDuration);
    }
  }, [ file ]);

  return (waveform.length > 0) ? (
    <TimelineWaveformLayer
      waveform={waveform}
      // color="rgb(46, 207, 235)"
      color="rgb(255, 255, 255)"
      duration={duration}
      measureWidth={measureWidth}
      unitsPerSecond={unitsPerSecond}
    />
  ) : '';
}

function TransportPositionCursor({
  active = true,
  position,
  measureWidth,
  color = 'var(--theme-primary-color)',
}) {
  return (
    <TimelineCursorPointerLayer
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
    <TimelineCursorPointerLayer
      active={true}
      x={(from.measure * measureWidth)}
      color={color}
      width={2}
    />
  ) : '';
}

function TransportInteractionCursor({
  onSelect,
  measureWidth,
  color = '#cccccc',
}) {
  return (
    <TimelineCursorLayer
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
    <TimelineCursorSelectionLayer
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
    else if (!transport.started) {
      transport.setProperties({
        playFrom: fromPosition,
      });
    }
  }

  const showLoop = loop;
  const showPosition = transport.started || transport.paused;
  const showPlayFrom = true;
  const showInteraction = true;

  const measuresPerSecond = (transport.tempo / transport.meter[0]) / 60
  const unitsPerSecond = measuresPerSecond * measureWidth;

  const common = { measureWidth, unitsPerSecond }

  return (
    <WebComponentsTimeline>
      <TimelineMeasuresLayer {...common}
        labelInterval={labelInterval}
        length={length}
      />
      <TransportWaveform {...common} />
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
    </WebComponentsTimeline>
  )
}
