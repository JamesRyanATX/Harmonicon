import {
  MenuDropdownItem,
  MenuDropdownHeader
} from '@composer/web-components';

import {
  IoRepeatSharp,
  IoPlaySharp,
  IoStopSharp,
  IoPauseSharp,
} from "react-icons/io5";

export function AudioDropdown() {
  return (
    <div>
      <MenuDropdownHeader label="Playback" />
      <MenuDropdownItem
        label="Play"
        icon={IoPlaySharp}
        disabled
      />
      <MenuDropdownItem
        label="Pause"
        icon={IoPauseSharp}
        disabled
      />
      <MenuDropdownItem
        label="Stop"
        icon={IoStopSharp}
        disabled
      />
      <MenuDropdownHeader label="Loop" />
      <MenuDropdownItem
        label="Set Position..."
        icon={IoRepeatSharp}
        disabled
      />
      <MenuDropdownItem
        label="Reset"
        disabled
      />
    </div>
  )
}





