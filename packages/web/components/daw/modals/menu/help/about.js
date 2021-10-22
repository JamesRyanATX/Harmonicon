import { Modal } from '@composer/web-components';
import { useController } from '../../../providers/controller';
import { GiSoundWaves } from 'react-icons/gi';

import styles from '../../../../../styles/logo.module.css';

function Logo({
  height = 50,
  padding = 10,
  color = 'var(--theme-neutral-color-10)'
}) {
  return (
    <div className={styles.logo} style={{
      color,
      height: `${height + (padding * 2)}px`,
      padding: `${padding}px`,
    }}>
      <span style={{
        fontSize: `${height * 1.2}px`,
        marginRight: `${height / 4}px`,
        marginTop: `${height * -0.1}px`,
      }}>
        <GiSoundWaves />
      </span>
      <span style={{
        fontSize: `${height}px`,
        lineHeight: `${height}px`,
      }}>
        harmonicon
      </span>
    </div>
  )
}

export function AboutModal() {
  const controller = useController();

  return (
    <Modal 
      onRequestClose={() => {
        controller.emit('modal:close')
      }}
      padding={0}
    >
      <div style={{
        backgroundColor: 'var(--theme-neutral-color-2)',
        borderBottom: '1px solid var(--theme-neutral-color-5)',
      }}>
        <Logo />
      </div>
      <div style={{
        padding: '20px',
        lineHeight: '175%',
        fontSize: '14px',
      }}>
        <p>
          Harmonicon is an experimental <a rel="noreferrer" href="https://en.wikipedia.org/wiki/Digital_audio_workstation" target="_blank">DAW</a> for composing music as code.
          It&rsquo;s geared towards composition over live performance and emphasizes music theory in the songwriting process.
        </p>
        <h2>
          Features
        </h2>
        <ul>
          <li>
            Human-readable composition language based in JavaScript
          </li>
          <li>
            Browser-based IDE with <a rel="noreferrer" href="https://microsoft.github.io/monaco-editor/" target="_blank">Visual Studio Code</a> technology
          </li>
          <li>
            Instruments, Tracks, Effects and Sends
          </li>
          <li>
          Built-in synthesizers and instrument library
          </li>
          <li>
            Key signatures and realtime pitch transposition
          </li>
          <li>
            Powered by the <a rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank">Web Audio API</a>, <a rel="noreferrer" href="https://tonejs.github.io/" target="_blank">Tone.js</a>, <a rel="noreferrer" href="https://github.com/tonaljs/tonal" target="_blank">Tonal</a>, <a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noreferrer">Monaco</a>, and <a href="https://nextjs.org/" rel="noreferrer" target="_blank">NextJS</a>.
          </li>
        </ul>
        <h2>
          Author
        </h2>
        <p>
          <a href="https://gitlab.com/JamesRyanATX" rel="noreferrer" target="_blank">@JamesRyanATX</a> builds this in his spare time.  Wanna help?
        </p>
      </div>
    </Modal>
  )
}