import { Panel, Patches, useEventListener } from '@composer/daw-components';
import { useController } from '../providers/controller';
import { useState } from 'react';

export function RoutesPanel() {
  const [ session, setSession ] = useState();
  const controller = useController();

  function parsed(composer) {
    setSession(composer.model);
  }

  useEventListener(controller, 'composer:parsed', parsed);

  return (
    <Panel 
      id="routes"
      label="Route Graph"
      flex={1}
      onClose={controller.toggleRoutesPanel.bind(controller)}
    >
      {session ? <Patches
        instruments={session.instruments}
        tracks={session.tracks}
        effects={session.effects}
        patches={session.patches}
      /> : ''}
    </Panel>
  )
}