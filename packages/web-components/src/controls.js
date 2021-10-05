import React from 'react';

import styles from '../styles/controls.module.css';

function Control({
  children = null,
  type = '',
  className = '',
  flex = 1,
}) {
  return (
    <div
      style={{ flex }}
      className={[
        styles.control,
        styles[type],
        className
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function Select({
  children = null,
  label = null,
  onChange = () => {},
  value = null,
  span = 1,
}) {
  return (
    <Control type="select" flex={span}>
      {label ? (
        <label>{label}:</label>
      ) : ''}
      <select value={value} onChange={(e) => (onChange(e.target.value))}>
        {children}
      </select>
    </Control>
  )
}

export function Button({
  children = null,
  onClick = () => {},
  narrow = false,
  primary = false,
}) {
  return (
    <Control type="button" flex="none" className={[
      primary ? styles.buttonIsPrimary : '',
      narrow ? styles.buttonIsNarrow : ''
    ].join(' ')}>
      <button onClick={onClick}>{children}</button>
    </Control>
  )
}

export function IconButton({
  icon = null,
  onClick = () => {},
}) {
  return (
    <Button onClick={onClick} narrow>{icon()}</Button>
  )
}