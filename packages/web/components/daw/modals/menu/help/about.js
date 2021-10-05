import { Modal } from '@composer/web-components';
import { useController } from '../../../providers/controller';
import { Logo } from '../../../../logo';

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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'var(--theme-neutral-color-2)',
        borderBottom: '1px solid var(--theme-neutral-color-5)',
        padding: '20px 0',
      }}>
        <Logo />
      </div>
      <div style={{
        padding: '20px',
        lineHeight: '175%',
        fontSize: '14px',
      }}>
        <p>
          Harmonicon is an experimental <a href="https://en.wikipedia.org/wiki/Digital_audio_workstation" target="_blank">DAW</a> for composing music as code.
          It's geared towards composition over live performance and emphasizes music theory in the songwriting process.
        </p>
        <h2>
          Features
        </h2>
        <ul>
          <li>
            Human-readable composition language based in JavaScript
          </li>
          <li>
            Browser-based IDE with <a href="https://microsoft.github.io/monaco-editor/" target="_blank">Visual Studio Code</a> technology
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
            Powered by the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank">Web Audio API</a>, <a href="https://tonejs.github.io/" target="_blank">Tone.js</a>, <a href="https://github.com/tonaljs/tonal" target="_blank">Tonal</a>, <a href="https://microsoft.github.io/monaco-editor/" target="_blank">Monaco</a>, and <a href="https://nextjs.org/" target="_blank">NextJS</a>.
          </li>
        </ul>
      </div>
    </Modal>
  )
}