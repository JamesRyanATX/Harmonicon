import {
  Menu as MenuBar,
  MenuItem,
} from '@composer/web-components';

import { FileDropdown } from './menu/file';
import { EditDropdown } from './menu/edit';
import { ViewDropdown } from './menu/view';
import { AudioDropdown } from './menu/audio';
import { HelpDropdown } from './menu/help';
import { MidiDropdown } from './menu/midi';

import styles from '../../styles/daw.menu.module.css';
import { useState } from 'react';


function Logo() {
  const [ offstage, setOffstage ] = useState(true);

  if (offstage) {
    setTimeout(() => (setOffstage(false)), 2000);
  }

  return (
    <div onClick={() => (setOffstage(true))} className={[
      styles.logo,
      offstage ? styles.logoIsOffstage : ''
    ].join(' ')}>
      <div className={styles.logoBars}>
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
      </div>
      {/* <div className={styles.logoLetter}>
        <div />
        <div />
        <div />
      </div> */}
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
  // console.log('menu')
  return (
    <MenuBar items={items} logo={() => (<Logo />)} />
  )
}