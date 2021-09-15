import {
  MenuDropdownItem,
} from '@composer/web-components';

import {
  IoArrowUndoSharp,
  IoArrowRedoSharp,
} from "react-icons/io5";

export function EditDropdown() {
  return (
    <div>
      <MenuDropdownItem
        label="Undo"
        icon={IoArrowUndoSharp}
        disabled
      />
      <MenuDropdownItem
        label="Redo"
        icon={IoArrowRedoSharp}
        disabled
      />
    </div>
  )
}