import { useEffect, useState } from 'react';
import { Panels, useEventListener, useViewport, useLocationParams } from '@composer/daw-components';

import { Transport } from './transport';
import { Menu } from './menu';
import { Modals } from './modals';
import { LibraryPanel } from './panels/library';
import { EditorPanel } from './panels/editor';
import { RoutesPanel } from './panels/routes';
import { ChordsPanel } from './panels/chords';
import { KeyboardPanel } from './panels/keyboard';
import { ConsolePanel } from './panels/console';
import { AboutModal } from './modals/menu/help/about';
import { SwitchToDropboxModal } from './modals/menu/settings/switch_to_dropbox';

import { useController } from './providers/controller';
import { useFile } from './providers/file';

import styles from '../styles/daw.module.css';

export function Interface ({
  breakpoint = 800
}) {
  const controller = useController();
  const file = useFile();
  const viewport = useViewport();
  const location = useLocationParams();

  const action = location.params.action;
  const mobile = viewport.width < breakpoint;
  const panels = controller.workspace.panels;

  const [ libraryEnabled, setLibraryEnabled ] = useState(panels.library.enabled);
  const [ routesEnabled, setRoutesEnabled ] = useState(panels.routes.enabled);
  const [ chordsEnabled, setChordsEnabled ] = useState(panels.chords.enabled);
  const [ keyboardEnabled, setKeyboardEnabled ] = useState(panels.keyboard.enabled);
  const [ consoleEnabled, setConsoleEnabled ] = useState(panels.console.enabled);

  useEventListener(controller, 'workspace:panels:library:show', function onLibraryShow() {
    setLibraryEnabled(true)
  });

  useEventListener(controller, 'workspace:panels:library:hide', function onLibraryHide () {
    setLibraryEnabled(false)
  });

  useEventListener(controller, 'workspace:panels:routes:show', function onRoutesShow () {
    setRoutesEnabled(true)
  });

  useEventListener(controller, 'workspace:panels:routes:hide', function onRoutesHide () {
    setRoutesEnabled(false)
  });

  useEventListener(controller, 'workspace:panels:chords:show', function onChordsShow () {
    setChordsEnabled(true)
  });

  useEventListener(controller, 'workspace:panels:chords:hide', function onChordsHide () {
    setChordsEnabled(false)
  });

  useEventListener(controller, 'workspace:panels:keyboard:show', function onKeyboardShow () {
    setKeyboardEnabled(true)
  });

  useEventListener(controller, 'workspace:panels:keyboard:hide', function onKeyboardHide () {
    setKeyboardEnabled(false)
  });

  useEventListener(controller, 'workspace:panels:console:show', function onConsoleShow () {
    setConsoleEnabled(true)
  });

  useEventListener(controller, 'workspace:panels:console:hide', function onConsoleHide () {
    setConsoleEnabled(false)
  });

  const columns = {
    left: [
      {
        id: 'library',
        enabled: mobile ? false : libraryEnabled,
        component: (<LibraryPanel />)
      },
      {
        id: 'chords',
        enabled: mobile ? false : chordsEnabled,
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
        enabled: mobile ? false : routesEnabled,
        component: (<RoutesPanel />)
      },
      {
        id: 'keyboard',
        enabled: mobile ? false : keyboardEnabled,
        component: (<KeyboardPanel />)
      },
    ],

  };

  useEffect(() => {
    if (action === 'switch-to-dropbox') {
      controller.emit('modal:open', { component: SwitchToDropboxModal, props: {} });
    }
    else {
      controller.emit('modal:open', { component: AboutModal, props: {} });
    }
  }, [ controller, action ]);

  return (
    <div className={styles.dawInterface}>
      <Menu controller={controller} />
      {file ? (
        <>
          <Panels columns={columns} />
          <Transport controller={controller} />
        </>
      ) : ''}
      <Modals />
    </div>
  )
}
