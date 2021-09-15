import {
  MenuDropdownItem,
} from '@composer/web-components';

import {
  IoBookSharp,
} from "react-icons/io5";

export function HelpDropdown() {
  return (
    <div>
      <MenuDropdownItem
        label="Documentation"
        href="/doc/compose/@composer/compose/1.0.0/index.html"
        icon={IoBookSharp}
      />
      <MenuDropdownItem
        label="About"
        disabled
      />
    </div>
  )
}