import {
  MenuDropdownItem,
  MenuDropdownDivider,
} from '@composer/daw-components';

import {
  IoAddSharp,
  IoDownloadOutline,
  IoTrashSharp,
} from "react-icons/io5";

import { ExportToWavModal } from '../modals/menu/file/export_to_wav';
import { ExportToMp3Modal } from '../modals/menu/file/export_to_mp3';

import { useController } from '../providers/controller';
import { useFile } from '../providers/file';

export function FileDropdown() {
  const controller = useController();
  const file = useFile();

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
        disabled={!file}
        onClick={() => { controller.save(); }}
      />
      <MenuDropdownItem
        label="Delete"
        disabled={!file}
        onClick={() => { 
          if (confirm(`Are you sure you want to delete ${controller.file.name}?`)) {
            controller.destroyFile(controller.file);
          };
        }}
      />
      <MenuDropdownDivider />
      <MenuDropdownItem
        label="Export to WAV..."
        disabled={!file}
        onClick={() => {
          controller.emit('modal:open', { component: ExportToWavModal, props: {} })
        }}
      />
      <MenuDropdownItem
        label="Export to MP3..."
        disabled={!file}
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