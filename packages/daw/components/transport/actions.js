import { useState } from 'react';
import { Items, Item, ItemPrimary, ItemLabel, ItemGrid, ItemGridRow } from './item';
import { useController } from '../providers/controller';
import { useEventListener } from '@composer/daw-components';

import {
  IoStopSharp,
  IoPlaySharp,
  IoReloadSharp,
  IoPauseSharp,
  IoPlaySkipBackSharp,
  IoPlayForwardSharp,
  IoPlayBackSharp,
} from "react-icons/io5";

function Action ({
  label = null,
  icon = null,
  selected = false,
  indicator = false,
  disabled = false,
  onClick = () => {},
  mini = false,
}) {
  const Icon = icon;

  return (
    <Item
      onClick={onClick}
      selected={selected}
      disabled={disabled}
      indicator={indicator}
      mini={mini}
    >
      <ItemPrimary>
        <Icon />
      </ItemPrimary>
      <ItemLabel>
        {label}
      </ItemLabel>
    </Item>
  )
}

export function Actions ({
}) {
  const controller = useController();
  const transport = controller.transport;

  const [ state, setState ] = useState(transport.state);  
  const [ position, setPosition ] = useState(transport.position);
  const [ loop, setLoop ] = useState(transport.loop);
  const [ loopFrom, setLoopFrom ] = useState(transport.loopFrom);
  const [ loopTo, setLoopTo ] = useState(transport.loopTo);

  useEventListener(transport, 'changed:position', function onPositionChanged ({ newValue }) {
    setPosition(newValue)
  });

  useEventListener(transport, 'changed:loop', function onLoopChanged ({ newValue }) {
    setLoop(newValue)
  });

  useEventListener(transport, 'changed:loopFrom', function onLoopFromChanged ({ newValue }) {
    setLoopFrom(newValue)
  });

  useEventListener(transport, 'changed:loopTo', function onLoopToChanged ({ newValue }) {
    setLoopTo(newValue)
  });

  useEventListener(transport, 'changed:state', function onStateChanged ({ newValue }) {
    setState(newValue);
  });

  return (
    <>
      <Items>
        <Action 
          icon={IoPlaySharp}
          label="Play"
          onClick={controller.play.bind(controller)}
          indicator={state === 'started'}
          disabled={!transport.canPlay}
        />
      </Items>
      <ItemGrid>
        <ItemGridRow>
          <Action 
            icon={IoPlaySkipBackSharp}
            onClick={() => { transport.restart(); }}
            disabled={!transport.canRestart}
            mini
          />
          <Action 
            icon={IoPlayBackSharp}
            onClick={transport.backwards.bind(transport)}
            disabled={!transport.canBackwards}
            mini
          />
          <Action 
            icon={IoPlayForwardSharp}
            onClick={transport.forwards.bind(transport)}
            disabled={!transport.canForwards}
            mini
          />
        </ItemGridRow>
        <ItemGridRow>
          <Action 
            icon={IoStopSharp}
            onClick={transport.stop.bind(transport)}
            disabled={!transport.canStop}
            mini
          />
          <Action 
            icon={IoPauseSharp}
            onClick={transport.pause.bind(transport)}
            indicator={state === 'paused'}
            disabled={!transport.canPause}
            mini
          />
          <Action 
            icon={IoReloadSharp}
            onClick={() => { transport.loop = !transport.loop; }}
            disabled={!loopFrom || !loopTo}
            indicator={loop}
            mini
          />
        </ItemGridRow>
      </ItemGrid>
    </>
  )
}
