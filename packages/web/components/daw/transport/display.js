import { useState } from 'react'
import NumberFormat from 'react-number-format';
import { useTransport } from '../providers/transport';
import { Items, Item, ItemPrimary, ItemLabel } from './item';

export function Display () {
  const transport = useTransport();

  const [ loaded, setLoaded ] = useState(false);
  const [ position, setPosition ] = useState(transport.position);
  const [ key, setKey ] = useState(transport.key);
  const [ scale, setScale ] = useState(transport.scale);
  const [ tempo, setTempo ] = useState(transport.tempo);
  const [ meter, setMeter ] = useState(transport.meter);

  if (!loaded) {
    transport.on('changed:position', ({ newValue }) => (setPosition(newValue)));
    transport.on('changed:key', ({ newValue }) => (setKey(newValue)));
    transport.on('changed:scale', ({ newValue }) => (setScale(newValue)));
    transport.on('changed:tempo', ({ newValue }) => (setTempo(newValue)));
    transport.on('changed:meter', ({ newValue }) => (setMeter(newValue)));

    setLoaded(true);
  }

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
          position
        </ItemLabel>
      </Item>
    </Items>
  )
}
