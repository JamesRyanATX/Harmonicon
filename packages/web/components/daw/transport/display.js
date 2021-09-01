import { useState } from 'react'
import NumberFormat from 'react-number-format';
import { Items, Item, ItemPrimary, ItemLabel } from './item';

export function Display ({ controller }) {
  const [ loaded, setLoaded ] = useState(false);
  const [ position, setPosition ] = useState({
    measure: 0,
    beat: 0,
    subdivision: 0,
    tempo: null,
    meter: null
  });

  if (!loaded) {
    controller.on('transport:position', setPosition);
    setLoaded(true);
  }

  return (
    <Items>
      <Item flat>
        <ItemPrimary>
          <input type="text" disabled value={position.key || '-'} />
        </ItemPrimary>
        <ItemLabel>
        {position.scale || 'key'}
        </ItemLabel>
      </Item>
      <Item flat>
        <ItemPrimary>
          <input type="text" disabled value={position.tempo || '-'} />
        </ItemPrimary>
        <ItemLabel>
        tempo
        </ItemLabel>
      </Item>
      <Item flat>
        <ItemPrimary>
          <input type="text" disabled value={position.meter || '-'} />
        </ItemPrimary>
        <ItemLabel>
          meter
        </ItemLabel>
      </Item>
      <Item flat>
        <ItemPrimary>
          <input type="text" disabled value={String(position.measure).padStart(2, '0')} />
        </ItemPrimary>
        <ItemLabel>
          measure
        </ItemLabel>
      </Item>
      <Item flat>
        <ItemPrimary>
          <input type="text" disabled value={String(position.beat).padStart(2, '0')} />
        </ItemPrimary>
        <ItemLabel>
          beat
        </ItemLabel>
      </Item>
      <Item flat wide>
        <ItemPrimary>
          <NumberFormat
            value={position.subdivision}
            displayType={'input'}
            thousandSeparator={true}
            allowLeadingZeros={true}
            decimalScale={3}
            fixedDecimalScale={true}
          />
        </ItemPrimary>
        <ItemLabel>
          subdivision
        </ItemLabel>
      </Item>
    </Items>
  )
}
