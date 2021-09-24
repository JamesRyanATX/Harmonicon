import { Panel, Patches } from '@composer/web-components';
import { useController } from '../providers/controller';
import { useState } from 'react';

export function RoutesPanel() {
  const [ loaded, setLoaded ] = useState(false);
  const [ session, setSession ] = useState();
  const controller = useController();

  function parsed(composer) {
    setSession(composer.model);
  }

  if (!loaded) {
    controller.on('composer:parsed', parsed);
  }

  return (
    <Panel id="routes" label="Route Graph" flex={session ? 1 : null}>
      {session ? <Patches
        instruments={session.instruments}
        tracks={session.tracks}
        effects={session.effects}
        patches={session.patches}
      /> : ''}
    </Panel>
  )
}