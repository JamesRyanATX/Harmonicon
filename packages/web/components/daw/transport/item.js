import { useState } from 'react';
import styles from '../../../styles/daw.transport.module.css';


export function Items({ children }) {
  return (
    <div className={styles.items}>
      {children}
    </div>
  )
}

export function Item({
  selected,
  disabled,
  indicator,
  wide,
  flat,
  onClick,
  children
}) {
  const [ active, setActive ] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseDown={() => (!flat && setActive(true))}
      onMouseUp={() => (!flat && setActive(false))}
      className={[ 
        styles.item,
        selected ? styles.itemIsSelected : null,
        disabled ? styles.itemIsDisabled : null,
        wide ? styles.itemIsWide : null,
        flat ? styles.itemIsFlat : null,
        active ? styles.itemIsActive : null 
      ].join(' ')}
    >
      {children}
      {indicator ? <div className={styles.itemIndicatorLight} /> : ''}
    </div>
  )
}

export function ItemPrimary({ children }) {
  return (
    <div className={styles.itemPrimary}>
      {children}
    </div>
  )
}

export function ItemLabel({ children }) {
  return (
    <div className={styles.itemLabel}>
      {children}
    </div>
  )
}
