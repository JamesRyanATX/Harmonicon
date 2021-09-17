import MonacoEditor from "@monaco-editor/react";
import { useState, useRef } from "react";
import { useController } from "./providers/controller";
import styles from '../../styles/daw.editor.module.css';

export function Editor ({
  layoutChangeDelay = 1000
}) {
  const controller = useController();
  const editorRef = useRef(null);

  const [ loaded, setLoaded ] = useState(false);
  const [ source, setSource ] = useState(controller.file.source);

  if (!loaded) {
    controller.on('file:selected', (file) => {
      setSource(file.source);
    });

    setLoaded(true);
  }

  function onMount(editor) {
    controller.editor = editorRef.current = editor;
  }

  function onChange(value) {
    controller.setFileSource(value);
  }

  function onKeyDown(e) {
    if (e.metaKey && e.key === 's') {
      e.preventDefault();
      e.stopPropagation();

      controller.setFileSource(editorRef.current.getValue());
      controller.save();
    }

    if (e.metaKey && e.key === 'p') {
      e.preventDefault();
      e.stopPropagation();

      controller.play();
    }
  }

  return (
    <div 
      className={styles.editor}
      onKeyDown={onKeyDown}
    >
      <MonacoEditor
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        value={source}
        onChange={onChange}
        onMount={onMount}
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