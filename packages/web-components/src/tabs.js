import * as React from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { Editable } from './editable';

import styles from '../styles/tabs.module.css';


export function TabIcon({
  onClick = () => {},
  icon = null,
}) {
  return (
    <div className={styles.tabIcon} onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      onClick();
    }}>
      {icon()}
    </div>
  )
}

export function TabLabel({
  label = null,
  onChange = () => {},
  editable = false,
}) {
  return (
    <div className={[
      styles.tabLabel,
    ].join(' ')}>
      {editable ? (
        <Editable
          value={label}
          onChange={onChange}
        />
      ) : label}
      <div className={styles.tabLabelEllipsis} />
    </div>
  )
}

export function TabClose({
  onClick = () => {},
}) {
  return (
    <div
      className={[
        styles.tabClose,
      ].join(' ')}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    >
      <IoCloseSharp/>
    </div>
  )
}

export function Tab({
  label = null,
  icon = null,
  onIconClick = () => {},
  onTabClick = () => {},
  onCloseClick = () => {},
  onRename = () => {},
  selected = false,
  close = true,
  children,
}) {
  return (
    <div
      onClick={(e) => {
        if (!selected) {
          onTabClick(e)
        }
      }}
      className={[
        styles.tab,
        selected ? styles.tabIsSelected : styles.tabIsUnselected
      ].join(' ')}
    >
      {children ? children : (
        <React.Fragment>
          {icon ? (
            <TabIcon
              onClick={onIconClick}
              icon={icon}
            />
          ) : ''}
          {label ? (
            <TabLabel
              label={label}
              editable={selected}
              onChange={onRename}
            />
           ) : ''}
          {close ? (
            <TabClose
              onClick={onCloseClick} 
            />
           ) : ''}
        </React.Fragment>
      )}
    </div>
  )
}

export function Tabs ({ children }) {
  return (
    <div className={styles.tabs}>
      {children}
    </div>
  )
}