import { Panel } from '@composer/web-components';

import { Switcher } from '../switcher';
import { Editor } from '../editor';
import { useController } from '../providers/controller';

export function EditorPanel() {
  const controller = useController();

  return (
    <Panel id="editor" label="Editor" flex={3} transparent sticky noscroll>
      <Switcher controller={controller} />
      <Editor controller={controller} />
    </Panel>
  )
}