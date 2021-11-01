import { useState } from 'react';
import styles from '../../styles/daw.transport.module.css';


export function Items({ children }) {
  return (
    <div className={styles.items}>
      {children}
    </div>
  )
}

export function Item({
  selected = false,
  disabled = false,
  indicator = false,
  wide = false,
  xWide = false,
  onClick = () => {},
  text = false,
  flat = false,
  mini = false,
  flex = false,
  children
}) {
  const [ active, setActive ] = useState(false);

  return (
    <div
      onClick={(e) => (!disabled && onClick(e))}
      onMouseDown={() => (!flat && setActive(true))}
      onMouseUp={() => (!flat && setActive(false))}
      className={[ 
        styles.item,
        selected ? styles.itemIsSelected : null,
        disabled ? styles.itemIsDisabled : null,
        wide ? styles.itemIsWide : null,
        xWide ? styles.itemIsXWide : null,
        mini ? styles.itemIsMini : null,
        flat ? styles.itemIsFlat : null,
        text ? styles.itemIsText : null,
        flex ? styles.itemIsFlexed : null,
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

export function ItemGrid({ children }) {
  return (
    <div className={styles.itemGrid}>
      {children}
    </div>
  )
}

export function ItemGridRow({ children }) {
  return (
    <div className={styles.itemGridRow}>
      {children}
    </div>
  )
}