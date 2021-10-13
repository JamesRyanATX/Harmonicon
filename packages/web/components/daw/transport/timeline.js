import { useEffect, useState } from 'react';
import { useController } from '../providers/controller';
import { renderWaveformTask } from '../tasks/render_waveform';
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
  pollFrequency = 10,
  poll = false,
}) {
  const controller = useController();

  const [ task, setTask ] = useState();
  const [ waveform, setWaveform ] = useState([]);
  const [ duration, setDuration ] = useState(0);

  let timer;

  function onTaskSuccess({ duration, waveform }) {
    setWaveform(waveform);
    setDuration(duration);  
}

  function onTaskError(error) {
    console.info(error);
  }

  function onTaskDone() {
    if (poll) {
      timer = setTimeout(() => { setTask(null); }, pollFrequency * 1000);
    }
  }

  if (!task) {
    const task = renderWaveformTask({ controller });

    task.on('success', onTaskSuccess);
    task.on('error', onTaskError);
    task.on('done', onTaskDone);

    setTask(task);

    task.run();
  }

  useEffect(() => {
    const reset = () => {
      setDuration(0);
      setWaveform([]);
      setTask(null)
    };

    controller.on('file:selected', reset);

    return () => {
      controller.off('file:selected', reset);
    }
  }, [ controller ]);

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
