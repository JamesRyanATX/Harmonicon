import { useState } from 'react';
import { Panel, PanelFilterRow, Select, Console, IconButton } from '@composer/web-components';
import { Harmonicon } from '@composer/core';
import { IoTrashSharp } from 'react-icons/io5';

export function ConsolePanel() {
  const [ level, setLevel ] = useState('debug');
  const [ logs, setLogs ] = useState([]);

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
      <Console target={Harmonicon.console} level={level} logs={logs} setLogs={setLogs} />
    </Panel>
  )
}