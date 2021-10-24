import {
  Menu as MenuBar,
  MenuItem,
} from '@composer/daw-components';

import { FileDropdown } from './menu/file';
import { EditDropdown } from './menu/edit';
import { ViewDropdown } from './menu/view';
import { AudioDropdown } from './menu/audio';
import { HelpDropdown } from './menu/help';
import { MidiDropdown } from './menu/midi';

import styles from '../../styles/daw.menu.module.css';
import { useState, useEffect } from 'react';

import { GiSoundWaves } from 'react-icons/gi';

function Bars() {
  const [ offstage, setOffstage ] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => (setOffstage(false)), 2000);

    return () => {
      clearTimeout(timer);
    }
  });

  return (
    <div onClick={() => (setOffstage(true))} className={[
      styles.bars,
      offstage ? styles.barsIsOffstage : ''
    ].join(' ')}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <h3><GiSoundWaves /> harmonicon</h3>
    </div>
  );
}

export function Menu({
  items = [
    {
      label: 'File',
      dropdown: FileDropdown,
    },
    // {
    //   label: 'Edit',
    //   dropdown: EditDropdown,
    // },
    // {
    //   label: 'Audio',
    //   dropdown: AudioDropdown,
    // },
    {
      label: 'View',
      dropdown: ViewDropdown,
    },
    {
      label: 'MIDI',
      dropdown: MidiDropdown,
    },
    {
      label: 'Help',
      dropdown: HelpDropdown,
    },
  ]
}) {
  return (
    <MenuBar
      items={items}
      after={() => (<Bars />)} 
    />
  )
}