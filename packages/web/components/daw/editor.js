import MonacoEditor from "@monaco-editor/react";

import styles from '../../styles/daw.editor.module.css';

export function Editor ({ controller }) {
  return (
    <div className={styles.editor}>
      <MonacoEditor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        defaultValue={controller.source}
        onChange={controller.setSource.bind(controller)}
        theme="vs-dark"
        options={{
          folding: true,
          tabSize: 2,
          padding: { top: 10 },
        }}
      />
    </div>
  )
}