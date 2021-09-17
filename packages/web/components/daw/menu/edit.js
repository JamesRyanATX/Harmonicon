import {
  MenuDropdownItem,
  MenuDropdownDivider,
} from '@composer/web-components';

import {
  IoCutSharp,
  IoCopySharp,
  IoClipboardSharp,
  IoArrowUndoSharp,
  IoArrowRedoSharp,
} from "react-icons/io5";

export function EditDropdown() {
  return (
    <div>
      <MenuDropdownItem
        label="Copy"
        onClick={() => { controller.editorCopy(); }}
      />
      <MenuDropdownItem
        label="Cut"
        onClick={() => { controller.editorCut(); }}
      />
      <MenuDropdownItem
        label="Paste"
        onClick={() => { controller.editorPaste(); }}
      />
      <MenuDropdownDivider />
      <MenuDropdownItem
        label="Undo"
        icon={IoArrowUndoSharp}
        onClick={() => { controller.editorUndo(); }}
      />
      <MenuDropdownItem
        label="Redo"
        icon={IoArrowRedoSharp}
        onClick={() => { controller.editorRedo(); }}
      />
    </div>
  )
}