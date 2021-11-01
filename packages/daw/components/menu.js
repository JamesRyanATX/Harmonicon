import { IoLogoGithub } from 'react-icons/io5';
import Image from 'next/image';

import {
  Menu as MenuBar,
} from '@composer/daw-components';

import { FileDropdown } from './menu/file';
import { ViewDropdown } from './menu/view';
import { HelpDropdown } from './menu/help';
import { MidiDropdown } from './menu/midi';
import { AboutModal } from './modals/menu/help/about';
import { useController } from './providers/controller';

import styles from '../styles/daw.menu.module.css';


function Before() {
  const controller = useController();

  return (
    <div className={styles.menuBefore}>
      <a onClick={() => {
        controller.emit('modal:open', { component: AboutModal, props: {} });
      }}>
        <Image src="/icon.white.png" height="17" width="17" alt="Harmonicon" />
      </a>
    </div>
  );
}

function After() {
  return (
    <div className={styles.menuAfter}>
      <a href="https://github.com/JamesRyanATX/harmonicon" rel="noreferrer" target="_blank">
        <IoLogoGithub />
      </a>
    </div>
  );
}

export function Menu({
  items = [
    {
      label: 'File',
      dropdown: FileDropdown,
    },
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
      className={styles.menu}
      before={() => (<Before />)} 
      after={() => (<After />)} 
    />
  )
}