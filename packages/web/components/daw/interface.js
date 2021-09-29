import { useState } from 'react';

import { Panels } from '@composer/web-components';
import { Transport } from './transport';
import { Menu } from './menu';
import { LibraryPanel } from './panels/library';
import { EditorPanel } from './panels/editor';
import { RoutesPanel } from './panels/routes';
import { ChordsPanel } from './panels/chords';
import { KeyboardPanel } from './panels/keyboard';
import { ConsolePanel } from './panels/console';
import { useController } from './providers/controller';

import styles from '../../styles/daw.module.css';

export function Interface ({
  logo = null,
}) {
  const controller = useController();
  const panels = controller.workspace.panels;

  const [ loaded, setLoaded ] = useState(false);
  
  const [ libraryEnabled, setLibraryEnabled ] = useState(panels.library.enabled);
  const [ routesEnabled, setRoutesEnabled ] = useState(panels.routes.enabled);
  const [ chordsEnabled, setChordsEnabled ] = useState(panels.chords.enabled);
  const [ keyboardEnabled, setKeyboardEnabled ] = useState(panels.keyboard.enabled);
  const [ consoleEnabled, setConsoleEnabled ] = useState(panels.console.enabled);

  if (!loaded) {
    controller.on('workspace:panels:library:show', () => (setLibraryEnabled(true)));
    controller.on('workspace:panels:library:hide', () => (setLibraryEnabled(false)));

    controller.on('workspace:panels:routes:show', () => (setRoutesEnabled(true)));
    controller.on('workspace:panels:routes:hide', () => (setRoutesEnabled(false)));

    controller.on('workspace:panels:chords:show', () => (setChordsEnabled(true)));
    controller.on('workspace:panels:chords:hide', () => (setChordsEnabled(false)));

    controller.on('workspace:panels:keyboard:show', () => (setKeyboardEnabled(true)));
    controller.on('workspace:panels:keyboard:hide', () => (setKeyboardEnabled(false)));

    controller.on('workspace:panels:console:show', () => (setConsoleEnabled(true)));
    controller.on('workspace:panels:console:hide', () => (setConsoleEnabled(false)));

    setLoaded(true);
  }

  const columns = {
    left: [
      {
        id: 'library',
        enabled: libraryEnabled,
        component: (<LibraryPanel />)
      },
      {
        id: 'chords',
        enabled: chordsEnabled,
        component: (<ChordsPanel />)
      },
    ],

    center: [
      {
        id: 'editor',
        enabled: true,
        component: (<EditorPanel />)
      },
      {
        id: 'console',
        enabled: consoleEnabled,
        component: (<ConsolePanel />)
      },
    ],

    right: [
      {
        id: 'routes',
        enabled: routesEnabled,
        component: (<RoutesPanel />)
      },
      {
        id: 'keyboard',
        enabled: keyboardEnabled,
        component: (<KeyboardPanel />)
      },
    ],

  };

  return (
    <div className={styles.dawInterface}>
      <Menu controller={controller} logo={logo} />
      <Panels columns={columns} />
      <Transport controller={controller} />
    </div>
  )
}
