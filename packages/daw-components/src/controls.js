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
  className = '',
  color = null,
  cta = false,
  external = false,
  flex = "none",
  narrow = false,
  onClick = () => {},
  primary = false,
  style = {},
}) {
  return (
    <Control type="button" flex={flex} className={[
      primary ? styles.buttonIsPrimary : '',
      narrow ? styles.buttonIsNarrow : '',
      cta ? styles.buttonIsCta : '',
    ].join(' ')}>
      <button onClick={onClick} className={className} style={{ color, flex, ...style }}>
        {children}
        {external ? (
          <span data-external />
        ) : ''}
      </button>
    </Control>
  )
}

export function IconButton({
  icon = null,
  color = null,
  onClick = () => {},
}) {
  return (
    <Button onClick={onClick} color={color} narrow>{icon()}</Button>
  )
}