import { useState } from 'react';
import { useWorkspace } from '../providers/workspace';
import { Panel, PanelFilterRow, Select, Console, IconButton, useConsoleLogs } from '@composer/daw-components';
import { IoTrashSharp } from 'react-icons/io5';

export function ConsolePanel() {
  const workspace = useWorkspace();
  const { setLogs } = useConsoleLogs();
  const [ level, setLevel ] = useState(workspace.panels.console.level);

  return (
    <Panel
      id="console"
      label="Console"
      flex={1}
      streaming
      onClose={controller.toggleConsolePanel.bind(controller)}
      filter={() => (
        <PanelFilterRow>
          <Select label="Filter" value={level} onChange={setLevel} span={1}>
            <option value="debug">Verbose (all)</option>
            <option value="info">Info</option>
            <option value="warning">Warnings</option>
            <option value="error">Errors</option>
          </Select>
          <IconButton
            icon={IoTrashSharp}
            title="foo"
            onClick={() => {
              setLogs([]);
            }}
          />
        </PanelFilterRow>
      )}
    >
      <Console level={level} />
    </Panel>
  )
}