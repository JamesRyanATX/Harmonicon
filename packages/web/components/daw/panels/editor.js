import { Panel } from '@composer/web-components';

import { Switcher } from '../switcher';
import { Editor } from '../editor';
import { Debugger } from '../debugger';

export function EditorPanel({
  controller = null,
  logo = null,
}) {
  return (
    <Panel id="editor" label="Editor" flex={1} transparent sticky noscroll>
      <Switcher controller={controller} logo={logo} />
      <Editor controller={controller} />
      <Debugger controller={controller} />
    </Panel>
  )
}