import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

import styles from '../styles/panels.module.css';

function PanelHeader ({
  label = 'Panel',
  onClose = () => {},
  sticky = false,
}) {
  return (
    <div className={styles.panelHeader}>
      {!sticky ? (
        <span>
          <a onClick={onClose}><IoCloseSharp/></a>
        </span>
      ) : ''}
      {label}
    </div>
  )
}

function PanelContent ({ children, noscroll }) {
  return (
    <div className={styles.panelContent} style={{
      overflowY: noscroll ? 'hidden' : 'auto',
    }}>
      {children}
    </div>
  )
}

export function Panel ({
  label = 'Panel',
  children = null,
  onClose = null,
  flex = 'none',
  width = 'auto',
  height = 'auto',
  transparent = false,
  sticky = false,
  noscroll = false,
}) {

  return (
    <div
      style={{ flex, width, height }}
      className={[
        styles.panel,
        transparent ? styles.panelIsTransparent : '',
      ].join(' ')}
    >
      <PanelHeader label={label} onClose={onClose} sticky={sticky} />
      <PanelContent children={children} noscroll={noscroll} />
    </div>
  )
}

export function Panels ({
  children = null,
  horizontal = false,
  vertical = false,
  flex = 'none',
  width = 'auto',
  height = 'auto',
}) {
  return (
    <div
      style={{ flex, width, height }}
      className={[
        styles.panels,
        horizontal ? styles.panelsAreHorizontal : '',
        vertical ? styles.panelsAreVertical : '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}