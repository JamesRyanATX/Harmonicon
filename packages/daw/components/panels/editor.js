import { Panel, useEventListener } from '@composer/daw-components';
import { Switcher } from '../switcher';
import { Editor } from '../editor';
import { useTransport } from '../providers/transport';
import { useState } from 'react';

export function EditorPanel() {
  const transport = useTransport();
  const [ disabled, setDisabled ] = useState(transport.started);

  function toggleDisabled () {
    setDisabled(transport.started);
  }

  useEventListener(transport, 'changed:state', toggleDisabled);

  return (
    <Panel
      id="editor"
      label={`Editor ${disabled ? '(read only)' : ''}`}
      flex={3}
      disabled={disabled}
      transparent
      sticky
      noscroll
    >
      <Switcher />
      <Editor disabled={disabled} />
    </Panel>
  )
}