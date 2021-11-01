import { useState } from 'react'
import { useEventListener } from '@composer/daw-components';
import { useTransport } from '../providers/transport';
import { Items, Item, ItemPrimary, ItemLabel } from './item';

export function Display () {
  const transport = useTransport();

  const [ position, setPosition ] = useState(transport.position);
  const [ key, setKey ] = useState(transport.key);
  const [ scale, setScale ] = useState(transport.scale);
  const [ tempo, setTempo ] = useState(transport.tempo);
  const [ meter, setMeter ] = useState(transport.meter);

  useEventListener(transport, 'changed:position', function onPositionChanged ({ newValue }) {
    setPosition(newValue);
  });
  
  useEventListener(transport, 'changed:key', function onKeyChanged ({ newValue }) {
    setKey(newValue);
  });
  
  useEventListener(transport, 'changed:scale', function onScaleChanged ({ newValue }) {
    setScale(newValue);
  });
  
  useEventListener(transport, 'changed:tempo', function onTempoChanged ({ newValue }) {
    setTempo(newValue);
  });
  
  useEventListener(transport, 'changed:meter', function onMeterChanged ({ newValue }) { 
    setMeter(newValue);
  });

  return (
    <Items>
      <Item flat>
        <ItemPrimary>
          {key || '-'}
        </ItemPrimary>
        <ItemLabel>
          {scale || 'key'}
        </ItemLabel>
      </Item>
      <Item flat>
        <ItemPrimary>
          {tempo || '-'}
        </ItemPrimary>
        <ItemLabel>
          tempo
        </ItemLabel>
      </Item>
      <Item flat>
        <ItemPrimary>
          <sup>{meter[0] || '-'}</sup>
          /
          <sub>{meter[1] || '-'}</sub>
        </ItemPrimary>
        <ItemLabel>
          meter
        </ItemLabel>
      </Item>
      <Item flat wide>
        <ItemPrimary>
          {String(position.measure).padStart(2, '0')}:
          {String(position.beat + 1).padStart(1, '0')}
        </ItemPrimary>
        <ItemLabel>
          measure
        </ItemLabel>
      </Item>
    </Items>
  )
}
