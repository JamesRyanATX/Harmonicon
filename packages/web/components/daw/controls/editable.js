import { useState } from 'react';
import styles from '../../../styles/daw.controls.editable.module.css';

export function Editable({ 
  value = '', 
  onChange = () => {}
}) {
  const [ editorValue, setEditorValue ] = useState(value);

  async function save({ target }) {
    const value = target.innerText;

    target.blur();

    setEditorValue(value)
    onChange(value);
  }

  async function onKeyDown (e) {
    if (
      e.code === 'Enter' ||
      e.code === 'Escape'
    ) {
      save(e);
    }
  }

  async function onBlur (e) {
    save(e);
  }

  async function onFocus (e) {
    // e.target.select();
  }

  return (
    <span 
      className={styles.editable}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      {editorValue}
    </span>
  )
}