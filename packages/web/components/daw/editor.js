import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";

import styles from '../../styles/daw.editor.module.css';

export function Editor ({ controller }) {
  const [ loaded, setLoaded ] = useState(false);
  const [ source, setSource ] = useState(controller.file.source);

  if (!loaded) {
    controller.on('file:selected', (file) => {
      setSource(file.source);
    });

    setLoaded(true);
  }

  return (
    <div className={styles.editor}>
      <MonacoEditor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        value={source}
        onChange={controller.setFileSource.bind(controller)}
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