import { useState } from 'react';
import { Harmonicon } from '@composer/core';

import {
  MenuDropdownItem,
} from '@composer/daw-components';

import {
  IoBookSharp, IoLogoGithub
} from "react-icons/io5";


import { AboutModal } from '../modals/menu/help/about';
import { useController } from '../providers/controller';

export function HelpDropdown() {
  const controller = useController();

  return (
    <div>
      <MenuDropdownItem
        label="Documentation"
        href={`/doc/compose/@composer/compose/${Harmonicon.version}/index.html`}
        icon={IoBookSharp}
      />
      <MenuDropdownItem
        label="GitHub"
        href="https://github.com/JamesRyanATX/harmonicon"
        icon={IoLogoGithub}
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