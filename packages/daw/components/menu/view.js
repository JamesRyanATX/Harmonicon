import {
  MenuDropdownItem,
} from '@composer/daw-components';

import {
  IoCheckmarkSharp
} from "react-icons/io5";

import { useController } from '../providers/controller';
import { useWorkspace } from '../providers/workspace';
import { useFile } from '../providers/file';

export function ViewDropdown() {
  const controller = useController();
  const workspace = useWorkspace();
  const file = useFile();

  return (
    <div>
      <MenuDropdownItem
        label="Library"
        disabled={!file}
        onClick={() => (controller.toggleLibraryPanel()) }
        icon={workspace.panels.library.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownItem
        label="Route Graph"
        disabled={!file}
        onClick={() => (controller.toggleRoutesPanel()) }
        icon={workspace.panels.routes.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownItem
        label="Chord Browser"
        disabled={!file}
        onClick={() => (controller.toggleChordsPanel()) }
        icon={workspace.panels.chords.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownItem
        label="Keyboard"
        disabled={!file}
        onClick={() => (controller.toggleKeyboardPanel()) }
        icon={workspace.panels.keyboard.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownItem
        label="Console"
        disabled={!file}
        onClick={() => (controller.toggleConsolePanel()) }
        icon={workspace.panels.console.enabled ? IoCheckmarkSharp : undefined}
      />
    </div>
  )
}