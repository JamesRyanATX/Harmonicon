import { useState } from 'react';

import {
  MenuDropdownItem,
} from '@composer/web-components';

import {
  IoBookSharp,
} from "react-icons/io5";

import { AboutModal } from '../modals/menu/help/about';
import { useController } from '../providers/controller';

export function HelpDropdown() {
  const controller = useController();

  return (
    <div>
      <MenuDropdownItem
        label="Documentation"
        href="/doc/compose/@composer/compose/1.0.0/index.html"
        icon={IoBookSharp}
      />
      <MenuDropdownItem
        label="About"
        onClick={() => {
          controller.emit('modal:open', { component: AboutModal, props: {} });
        }}
      />
    </div>
  )
}