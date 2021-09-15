import { useState } from 'react';
import { Panels } from '@composer/web-components';

import { Transport } from './transport';
import { Menu } from './menu';
import { LibraryPanel } from './panels/library';
import { EditorPanel } from './panels/editor';
import { RoutesPanel } from './panels/routes';
import { ChordsPanel } from './panels/chords';
import { KeyboardPanel } from './panels/keyboard';
import { useController } from './providers/controller';

import styles from '../../styles/daw.module.css';


export function Interface ({
  logo = null,
}) {
  const controller = useController();
  const panels = controller.workspace.panels;

  const [ loaded, setLoaded ] = useState(false);
  const [ library, setLibrary ] = useState(panels.library.enabled);
  const [ routes, setRoutes ] = useState(panels.routes.enabled);
  const [ chords, setChords ] = useState(panels.chords.enabled);
  const [ keyboard, setKeyboard ] = useState(panels.keyboard.enabled);

  if (!loaded) {
    controller.on('workspace:panels:library:show', () => (setLibrary(true)));
    controller.on('workspace:panels:library:hide', () => (setLibrary(false)));

    controller.on('workspace:panels:routes:show', () => (setRoutes(true)));
    controller.on('workspace:panels:routes:hide', () => (setRoutes(false)));

    controller.on('workspace:panels:chords:show', () => (setChords(true)));
    controller.on('workspace:panels:chords:hide', () => (setChords(false)));

    controller.on('workspace:panels:keyboard:show', () => (setKeyboard(true)));
    controller.on('workspace:panels:keyboard:hide', () => (setKeyboard(false)));

    setLoaded(true);
  }

  return (
    <div className={styles.daw}>
      <Menu controller={controller} logo={logo} />
      <Panels horizontal flex>
        {library ? (<LibraryPanel controller={controller} />) : ''}

        <EditorPanel controller={controller} logo={logo} />

        {routes || chords || keyboard ? (
          <Panels id="sidebar" vertical width="200px">
            {routes ? (<RoutesPanel controller={controller} />) : ''}
            {chords ? (<ChordsPanel controller={controller} />) : ''}
            {keyboard ? (<KeyboardPanel controller={controller} />) : ''}
          </Panels>
        ) : ''}

      </Panels>
      <Transport controller={controller} />
    </div>
  )
}
