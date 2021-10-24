import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { IoCloseSharp } from 'react-icons/io5';
import { Mosaic } from 'react-mosaic-component';
import { LoadingBar } from './loading';

import 'react-mosaic-component/react-mosaic-component.css';

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

function PanelContent ({ children, noscroll, streaming }) {
  if (streaming) {
    return (
      <ScrollToBottom className={styles.panelContent}>
        {children}
      </ScrollToBottom>
    );
  }
  else {
    return (
      <div className={styles.panelContent} style={{ 
        overflowY: noscroll ? 'hidden' : 'auto'
      }}>
        {children}
      </div>
    );
  }
}

export function PanelFilter({
  children = null,
}) {
  return (
    <div className={styles.panelFilter}>
      {children}
    </div>
  );
}

export function PanelFilterRow({
  children = null,
}) {
  return (
    <div className={styles.panelFilterRow}>
      {children}
    </div>
  );
}

export function PanelMask() {
  return (
    <div className={styles.panelMask}>
      <LoadingBar height={7} />
    </div>
  );
}

export function Panel ({
  label = 'Panel',
  children = null,
  onClose = null,
  flex = 'none',
  width = 'auto',
  height = 'auto',
  disabled = false,
  transparent = false,
  sticky = false,
  noscroll = false,
  filter = null,
  streaming = false,
}) {

  return (
    <div
      style={{ flex, width, height }}
      className={[
        styles.panel,
        transparent ? styles.panelIsTransparent : '',
        disabled ? styles.panelIsDisabled : '',
      ].join(' ')}
    >
      <PanelHeader label={label} onClose={onClose} sticky={sticky} />
      {filter ? (
        <PanelFilter>{filter()}</PanelFilter>
      ) : ''}
      <PanelContent noscroll={noscroll} streaming={streaming}>
        {children}
      </PanelContent>
      {disabled ? <PanelMask /> : ''}
    </div>
  )
}

export function Panels({
  columns = {}
}) {

  function threePanelLayout(columns) {
    let layout, tiles;

    columns.left = columns.left.filter((p) => p.enabled);
    columns.center = columns.center.filter((p) => p.enabled);
    columns.right = columns.right.filter((p) => p.enabled);

    function column(tiles, { splitPercentage }) {
      if (tiles.length === 0) {
        return null;
      }
      else if (tiles.length === 1) {
        return tiles[0].id;
      }
      else {
        return {
          direction: 'column',
          splitPercentage: splitPercentage,
          first: tiles[0].id,
          second: tiles[1].id,
        }
      }
    }

    if (columns.left.length === 0) {
      layout = {
        direction: 'row',
        splitPercentage: 80,
        first: column(columns.center, { splitPercentage: 80 }),
        second: column(columns.right, { splitPercentage: 25 }),
      }
    }
    else {
      layout = {
        direction: 'row',
        splitPercentage: 20,
        first: column(columns.left, { splitPercentage: 33 }),
        second: columns.right.length === 0
          ? column(columns.center, { splitPercentage: 50 })
          : {
            direction: 'row',
            splitPercentage: 75,
            first: column(columns.center, { splitPercentage: 50 }),
            second: column(columns.right, { splitPercentage: 25 })
          }
      }
    }

    tiles = Object.entries(columns).reduce((tiles, [ column, members ]) => {
      members.forEach((member) => {
        tiles[member.id] = member.component;
      });

      return tiles;
    }, {});

    return { layout, tiles };
  }

  const { layout, tiles } = threePanelLayout(columns);

  return (
    <Mosaic
      renderTile={(id) => tiles[id]}
      className={''}
      initialValue={layout}
    />
  )

}