import { useState } from 'react'
import NumberFormat from 'react-number-format';
import { Items, Item, ItemPrimary, ItemLabel } from './item';

export function Display ({ controller }) {
  const [ loaded, setLoaded ] = useState(false);
  const [ position, setPosition ] = useState({
    measure: 0,
    beat: 0,
    subdivision: 0,
  });

  if (!loaded) {
    controller.on('transport:position', setPosition);
    setLoaded(true);
  }

  return (
    <Items>
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
