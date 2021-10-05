import {
  MenuDropdownItem,
  MenuDropdownDivider,
} from '@composer/web-components';

import {
  IoAddSharp,
  IoDownloadOutline,
  IoTrashSharp,
} from "react-icons/io5";

import { ExportToWavModal } from '../modals/menu/file/export_to_wav';
import { ExportToMp3Modal } from '../modals/menu/file/export_to_mp3';

import { useController } from '../providers/controller';

export function FileDropdown() {
  const controller = useController();

  return (
    <div>
      <MenuDropdownItem
        label="New Session"
        icon={IoAddSharp}
        onClick={() => { controller.addFile(); }}
      />
      <MenuDropdownDivider />
      <MenuDropdownItem
        label="Save"
        onClick={() => { controller.save(); }}
      />
      <MenuDropdownItem
        label="Delete"
        onClick={() => { 
          if (confirm(`Are you sure you want to delete ${controller.file.name}?`)) {
            controller.destroyFile(controller.file);
          };
        }}
      />
      <MenuDropdownItem
        label="Download"
        icon={IoDownloadOutline}
        disabled
      />
      <MenuDropdownDivider />
      <MenuDropdownItem
        label="Export to WAV..."
        onClick={() => {
          controller.emit('modal:open', { component: ExportToWavModal, props: {} })
        }}
      />
      <MenuDropdownItem
        label="Export to MP3..."
        onClick={() => {
          controller.emit('modal:open', { component: ExportToMp3Modal, props: {} })
        }}
      />
      <MenuDropdownDivider />
      <MenuDropdownItem
        label="Reset Workspace"
        icon={IoTrashSharp}
        onClick={() => { 
          if (confirm("This will erase your workspace and reset to a blank slate.\n\nYou sure bout that, Clark?")) {
            controller.wipe();
          };
        }}
      />
    </div>
  )
}