import {
  MenuDropdownItem,
  MenuDropdownHeader
} from '@composer/web-components';

import {
  IoCheckmarkSharp
} from "react-icons/io5";

import { useController } from '../providers/controller';
import { useWorkspace } from '../providers/workspace';

export function ViewDropdown() {
  const controller = useController();
  const workspace = useWorkspace();

  return (
    <div>
      <MenuDropdownHeader label="Layout" />
      <MenuDropdownItem
        label="Library"
        onClick={controller.toggleLibraryPanel.bind(controller)}
        icon={workspace.panels.library.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownItem
        label="Route Map"
        onClick={controller.toggleRoutesPanel.bind(controller)}
        icon={workspace.panels.routes.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownItem
        label="Chord Finder"
        onClick={controller.toggleChordsPanel.bind(controller)}
        icon={workspace.panels.chords.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownItem
        label="Keyboard"
        onClick={controller.toggleKeyboardPanel.bind(controller)}
        icon={workspace.panels.keyboard.enabled ? IoCheckmarkSharp : undefined}
      />
      <MenuDropdownHeader label="Editor" />
      <MenuDropdownItem
        label="Minimap"
        icon={IoCheckmarkSharp}
        disabled
      />
      <MenuDropdownItem
        label="Line Numbers"
        icon={IoCheckmarkSharp}
        disabled
      />
    </div>
  )
}