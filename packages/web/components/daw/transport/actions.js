import { useState } from 'react';
import { Items, Item, ItemPrimary, ItemLabel } from './item';

import {
  IoStopSharp,
  IoPlaySharp,
  IoReloadSharp,
  IoPauseSharp,
  IoSaveSharp,
} from "react-icons/io5";

function Action ({
  label,
  icon,
  selected,
  indicator,
  disabled,
  onClick
}) {
  const Icon = icon;

  return (
    <Item
      onClick={onClick}
      selected={selected}
      disabled={disabled}
      indicator={indicator}
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

export function Actions ({ controller }) {
  const [ loaded, setLoaded ] = useState(false);
  const [ transportState, setTransportState ] = useState(controller.state);
  const [ changed, setChanged ] = useState(controller.changed);

  if (!loaded) {
    controller.on('transport:start', setTransportState);
    controller.on('transport:stop', setTransportState);
    controller.on('transport:pause', setTransportState);
    controller.on('transport:loop', setTransportState);
    controller.on('changed', setChanged);

    setLoaded(true);
  }

  return (
    <Items>
      <Action 
        icon={IoPlaySharp}
        label="Play"
        onClick={controller.play.bind(controller)}
        selected={transportState === 'started'}
        indicator={transportState === 'started'}
      />
      <Action 
        icon={IoPauseSharp}
        label="Pause"
        onClick={controller.pause.bind(controller)}
        indicator={transportState === 'paused'}
      />
      <Action 
        icon={IoStopSharp}
        label="Stop"
        onClick={controller.stop.bind(controller)}
      />
      <Action 
        icon={IoSaveSharp}
        label="Save"
        onClick={controller.save.bind(controller)}
      />
      {/* <Action
        icon={IoReloadSharp}
        label="Reload"
        onClick={controller.reload.bind(controller)}
        disabled={!changed}
      /> */}
    </Items>
  )
}
