import React from 'react';

import styles from '../styles/controls.module.css';

function Control({
  children = null,
  type = '',
  flex = 1,
}) {
  return (
    <div
      style={{ flex }}
      className={[
        styles.control,
        styles[type]
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

export function IconButton({
  icon = null,
  onClick = () => {},
}) {
  return (
    <Control type="button" flex="none">
      <button onClick={onClick}>{icon()}</button>
    </Control>
  )
}