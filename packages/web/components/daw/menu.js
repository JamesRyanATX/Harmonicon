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

import styles from '../../styles/daw.module.css';

export function Menu({
  logo = null,
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
    <MenuBar items={items}>
      <MenuItem>
        <div className={styles.logo}>
          {logo({ size: "small" })}
        </div>
      </MenuItem>
    </MenuBar>
  )
}