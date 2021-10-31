import { Button, Modal, ModalActions } from '@composer/daw-components';
import { range } from '@composer/util';
import { useController } from '../../../providers/controller';
import { GiSoundWaves } from 'react-icons/gi';
import { IoPlaySharp } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import styles from '../../../../styles/logo.module.css';

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

function ExternalLink({
  href = null,
  children = null,
}) {
  return (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  )
}

function Illustration({ frame }) {
  return (
    <div className={styles.illustration}>
      <div className={styles.illustrationIde}>
        <h3>
          IDE
        </h3>
        <h4>
          Integrated Development Environment
        </h4>
      </div>
      <div className={styles.illustrationPlus}>
        <div /><div />
      </div>
      <div className={styles.illustrationDaw}>
        <h3>
          DAW
        </h3>
        <h4>
          Digital Audio Workstation
        </h4>
      </div>
    </div>
  )
}

function Teasers({ children }) {
  return (
    <div className={styles.teasers}>
      <div className={styles.teasersStage}>
        {children}
      </div>
      <div className={styles.teasersFader} data-top/>
      <div className={styles.teasersFader} data-bottom />
    </div>
  );
}

function Controls({
  frame = 0,
  firstFrame = null,
  lastFrame = null,
  onClick = () => {}
}) {
  return (
    <div className={styles.controls}>
      {range(firstFrame, lastFrame).map((i) => {
        return (
          <div current={frame === i ? 1 : undefined} key={i} onClick={() => (onClick(i))} />
        )
      })}
    </div>
  );
}

export function AboutModal({
  speed = 5,
  firstFrame = 0,
  lastFrame = 2,
}) {
  const controller = useController();
  const [ frame, setFrame ] = useState(firstFrame);

  useEffect(() => {
    if (frame === lastFrame) {
      return;
    }

    let timeout = setTimeout(() => {
      setFrame(frame + 1);
    }, speed * 1000);

    return () => {
      clearTimeout(timeout);
    }
  });  

  return (
    <Modal 
      onRequestClose={() => {
        controller.emit('modal:close')
      }}
      padding={0}
      width={800}
    >
      <div
        className={styles.animation}
        data-frame={frame}
        onClick={() => (setFrame(frame === lastFrame ? 0 : frame + 1))}
      >
        <Logo />
        <Illustration frame={frame} />
        <Teasers>
          <div data-frame="0">
            Harmonicon is an <strong>experimental</strong>{' '} tool for composing music as code.
          </div>
          <div data-frame="1">
            Use JavaScript to compose <strong>tracks</strong>, <strong>effects</strong> and <strong>instruments</strong> all in your browser.
          </div>
          <div data-frame="2" style={{ display: 'flex', height: 'auto', justifyContent: 'center' }}>
            <Button
              onClick={() => (controller.emit('modal:close'))}
              className={[ styles.teaserButton, styles.teaserButtonCode ].join(' ')}
              primary
              cta
            >
              <span style={{ color: 'var(--theme-palette-purple)' }}>try</span> &#123;{' '}
              <span style={{ color: 'var(--theme-neutral-color-10)' }}>Harmonicon()</span> &#125;
            </Button>

            <Button
              onClick={() => (controller.emit('modal:close'))}
              className={[ styles.teaserButton, styles.teaserButtonPlay ].join(' ')}
              primary
              cta
            >
              <IoPlaySharp />
            </Button>
          </div>
        </Teasers>
        <Controls
          frame={frame}
          firstFrame={firstFrame}
          lastFrame={lastFrame}
          onClick={(i) => (setFrame(i))}
        />
      </div>

        {/* <ul style={{ marginBottom: '25px' }}>
          <li>
            Browser-based{' '}
            <ExternalLink href="https://en.wikipedia.org/wiki/Integrated_development_environment">IDE</ExternalLink> with {' '}
            <ExternalLink href="https://microsoft.github.io/monaco-editor/">Visual Studio Code</ExternalLink> technology
          </li>
          <li>
            Human-readable <ExternalLink href="/doc/compose/@composer/compose/1.0.0/index.html">composition language</ExternalLink> based in JavaScript
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
            Powered by the{' '}
            <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web Audio API</ExternalLink>,{' '}
            <ExternalLink href="https://tonejs.github.io/">Tone.js</ExternalLink>,{' '}
            <ExternalLink href="https://github.com/tonaljs/tonal">Tonal</ExternalLink>,{' '}
            <ExternalLink href="https://microsoft.github.io/monaco-editor/">Monaco</ExternalLink>, and{' '}
            <ExternalLink href="https://nextjs.org/">NextJS</ExternalLink>.
          </li>
        </ul> */}
      {/* <ModalActions style={{ justifyContent: 'center', paddingBottom: '40px' }}>
        <Button
          onClick={() => (setFrame(firstFrame))}
          style={{
            padding: '20px 40px'
          }}
          primary
          cta
        >
          Play Now
        </Button>
      </ModalActions> */}
    </Modal>
  )
}