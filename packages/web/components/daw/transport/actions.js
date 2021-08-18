import { useState } from 'react';
import { Items, Item, ItemPrimary, ItemLabel } from './item';

import {
  IoStopSharp,
  IoPlaySharp,
  IoReloadSharp,
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
  const [ state, setState ] = useState(controller.state);
  const [ changed, setChanged ] = useState(controller.changed);

  if (!loaded) {
    controller.on('state', setState);
    controller.on('changed', setChanged);

    setLoaded(true);
  }

  return (
    <Items>
      <Action 
        icon={IoPlaySharp}
        label="Play"
        onClick={controller.play.bind(controller)}
        selected={state === 'started'}
        indicator={state === 'started'}
      />
      <Action 
        icon={IoStopSharp}
        label="Stop"
        onClick={controller.stop.bind(controller)}
      />
      <Action
        icon={IoReloadSharp}
        label="Reload"
        onClick={controller.reload.bind(controller)}
        disabled={!changed}
      />
    </Items>
  )
}
