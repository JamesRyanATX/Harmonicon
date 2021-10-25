import {
  MenuDropdownItem,
  MenuDropdownHeader,
} from '@composer/daw-components';

import * as DropboxStorageDriver from '@composer/driver-storage-dropbox';

import { IoCheckmarkSharp } from "react-icons/io5";

import { SwitchToLocalstorageModal } from '../modals/menu/settings/switch_to_localstorage';
import { SwitchToDropboxModal } from '../modals/menu/settings/switch_to_dropbox';

function StorageSettings() {
  const current = localStorage['harmonicon.storage'] || 'localstorage';
  const drivers = [
    {
      modal: SwitchToLocalstorageModal,
      label: 'Local Storage',
      id: 'localstorage'
    },
    {
      modal: SwitchToDropboxModal,
      label: 'Dropbox',
      id: 'dropbox'
    },
  ]

  return (
    <>
      <MenuDropdownHeader label="File Store" />
      {drivers.map((driver) => (
        <MenuDropdownItem
          key={driver.id}
          label={driver.label}
          disabled={false}
          onClick={() => {
            if (current !== driver.id) {
              controller.emit('modal:open', driver.modal);
            }
          }}
          icon={current === driver.id ? IoCheckmarkSharp : null}
        />
      ))}
    </>
  )
}

export function SettingsDropdown() {

  // async function selectDropbox() {
  //   const driver = new DropboxStorageDriver.Driver({
  //     clientId: config.dropbox.clientId,
  //     prefix: config.dropbox.prefix,
  //     applicationUrl: document.location.origin
  //   })

  //   document.location = await driver.getAuthenticationUrl({
  //     returnPath: '/?action=switch-to-dropbox'
  //   });
  // }

  return (
    <StorageSettings />
  )
}