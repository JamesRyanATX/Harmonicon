import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { IoCloseSharp } from 'react-icons/io5';

import { Button } from './controls';
import { LoadingBar } from './loading';

import styles from '../styles/modal.module.css';

/**
 * 
 * @param {object} props
 * @param {number} props.gutter - min spacing to the left and right of modal
 * @param {number} width - max width of modal
 * @returns
 */
export function Modal({
  blocking = false,
  children = 'Modal',
  className = '',
  gutter = 50,
  height = 'auto',
  onRequestClose = () => {},
  open = true,
  padding = 20,
  title = 'Heads Up',
  width = 700,
  working = false,
  workingPercentComplete = 1,
}) {
  const closeable = !blocking && !working;

  return (
    <ReactModal
      isOpen={open}
      onRequestClose={closeable ? onRequestClose : () => {}}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={closeable}
      shouldCloseOnEsc={closeable}
      overlayClassName={[
        'ReactModal__Overlay',
        styles.overlay
      ].join(' ')}
      className={[
        'ReactModal__Content',
        styles.modal,
        working ? styles.modalIsWorking : '',
        className,
      ].join(' ')}
      style={{
        content: {
          height: height,
          maxWidth: `${width}px`
        }
      }}
    >
      <div className={styles.modalTitleBar}>
        <a onClick={onRequestClose}>
          <IoCloseSharp />
        </a>
        {title}
      </div>
      <div className={styles.modalContent} style={{
        padding
      }}>
        {children}
      </div>
      {working ? (
        <div className={styles.modalIndicator}>
          <LoadingBar percentComplete={workingPercentComplete} />
        </div>
      ) : ''}
    </ReactModal>
  )
};

export function ModalActions({
  children = null,
  disabled = false,
  style = {},
}) {
  return (
    <div className={styles.modalActions} style={style}>
      {children}
      {disabled ? (<div className={styles.modalActionsMask} />) : ''}
    </div>
  )
}

export function DialogModal({
  buttons = [ { label: 'OK', onClick: () => {} } ],
  error = null,
  icon = null,
  onRequestClose = () => {},
  text = 'Text',
  title = 'Dialog',
  working = false,
  workingPercentComplete = 1,
}) {
  return (
    <Modal
      onRequestClose={onRequestClose}
      className={styles.dialog}
      working={working}
      workingPercentComplete={workingPercentComplete}
    >
      {icon ? (
        <div className={styles.dialogIcon}>
          {icon()}
        </div>
      ) : ''}
      <div className={styles.dialogContent}>
        <div className={styles.dialogTitle}>
          {title}
        </div>
        <div className={styles.dialogText}>
          {text}
        </div>
        <ModalActions disabled={working}>
          {buttons.map((button) => (
            <Button key={button.label} {...button}>
              {button.label}
            </Button>
          ))}
        </ModalActions>
        {error ? (
          <div className={styles.dialogError}>
            {error}
          </div>
        ) : ''}
      </div>
    </Modal>
  )
}

export function ConfirmModal({
  cancelLabel = 'Cancel',
  confirmLabel = 'OK',
  initialProgress = 0.01,
  onClose = () => {},
  showProgress = false,
  text = 'Text',
  title = 'Confirm',
  working = false,
}) {
  const [ percentComplete, setPercentComplete ] = useState(showProgress ? initialProgress : 1);
  const [ isRunning, setIsRunning ] = useState(false);
  const [ error, setError ] = useState();
  const [ task, setTask ] = useState(arguments[0].task);

  useEffect(() => {
    task.on('run', () => {
      if (!showProgress) {
        setPercentComplete(1);
      }
      
      setIsRunning(true);
    });

    task.on('progress', (amount) => {
      setPercentComplete(amount);
    });

    task.on('success', onClose);

    task.on('error', (error) => {
      setError('Something went wrong.');
      setIsRunning(false);
    });
  })

  return (
    <DialogModal
      title={title}
      text={text}
      error={error}
      working={working || isRunning}
      workingPercentComplete={percentComplete}
      onRequestClose={onClose}
      buttons={[
        {
          label: confirmLabel,
          onClick: () => {
            task.run();
            setTask(task);
          },
          primary: true,
        },
        {
          label: cancelLabel,
          onClick: onClose
        },
      ]}
    />
  )
}
