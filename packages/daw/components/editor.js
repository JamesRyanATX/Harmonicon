import MonacoEditor from "@monaco-editor/react";
import { useEventListener } from "@composer/daw-components";
import { useState, useRef } from "react";
import { useController } from "./providers/controller";
import { useFile } from "./providers/file";

import styles from '../styles/daw.editor.module.css';

export function Editor ({
  disabled = false,
}) {
  const controller = useController();
  const file = useFile();
  const editorRef = useRef(null);

  const [ source, setSource ] = useState(file ? file.source : '');

  function onFileSelected(file) {
    if (file) {
      setSource(file.source);
    }
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

  useEventListener(controller, 'file:selected', onFileSelected);

  return (
    <div 
      className={styles.editor}
      onKeyDown={onKeyDown}
    >
      {file ? (
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
            readOnly: disabled,
          }}
        />
      ) : ''}
    </div>
  );
}