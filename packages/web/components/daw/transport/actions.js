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

export function Actions ({
  controller = null,
  play = true,
  pause = false,
  stop = true,
  save = false,
  wipe = false,
  status = true,
}) {
  const [ loaded, setLoaded ] = useState(false);
  const [ transportState, setTransportState ] = useState(controller.state);
  const [ changed, setChanged ] = useState(controller.changed);
  const [ statusText, setStatusText ] = useState('');

  if (!loaded) {
    controller.on('composer:parsing', () => (setStatusText('Parsing...')));
    controller.on('composer:parsed', () => (setStatusText('')));
    controller.on('composer:rendering', () => (setStatusText('Rendering...')));
    controller.on('composer:rendered', () => (setStatusText('')));

    controller.on('transport:start', setTransportState);
    controller.on('transport:stop', setTransportState);
    controller.on('transport:pause', setTransportState);
    controller.on('transport:loop', setTransportState);
    controller.on('changed', setChanged);

    setLoaded(true);
  }

  return (
    <Items>
      {play ? (
        <Action 
          icon={IoPlaySharp}
          label="Play"
          onClick={controller.play.bind(controller)}
          selected={transportState === 'started'}
          indicator={transportState === 'started'}
        />
      ) : ''}
      {pause ? (
        <Action 
          icon={IoPauseSharp}
          label="Pause"
          onClick={controller.pause.bind(controller)}
          indicator={transportState === 'paused'}
        />
      ) : ''}
      {stop ? (
        <Action 
          icon={IoStopSharp}
          label="Stop"
          onClick={controller.stop.bind(controller)}
        />
      ) : ''}
      {save ? (
        <Action 
          icon={IoSaveSharp}
          label="Save"
          onClick={controller.save.bind(controller)}
        />
      ) : ''}
      {wipe ? (
        <Action 
          icon={IoReloadSharp}
          label="Wipe"
          onClick={controller.wipe.bind(controller)}
        />
      ) : ''}
      {status && statusText ? (
        <Item flat text>
          {statusText}
        </Item>
      ) : ''}
    </Items>
  )
}
