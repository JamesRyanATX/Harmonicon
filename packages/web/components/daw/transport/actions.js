import { useState } from 'react';
import styles from '../../../styles/daw.transport.module.css';

import {
  IoPlaySharp,
  IoPauseSharp,
  IoPlayForwardSharp,
  IoPlayBackSharp,
  IoPlaySkipBackSharp,
} from "react-icons/io5";

function Action ({
  title,
  icon,
  selected,
  onClick
}) {
  const Icon = icon;

  return (
    <a 
      onClick={onClick}
      title={title}
      className={[ styles.action, selected ? styles.actionSelected : null ].join(' ')}
    >
      <Icon />
    </a>
  )
}

export function Actions ({ controller }) {
  const [ state, setState ] = useState({
    state: controller.state
  });

  controller.registerStateListener(setState);

  return (
    <div className={styles.actions}>
      {(state === 'started') ? (
        <Action 
          icon={IoPauseSharp}
          label="Pause session audio"
          onClick={controller.playOrPause.bind(controller)}
          selected
        />
      ) : (
        <Action 
          icon={IoPlaySharp}
          label="Play session audio"
          onClick={controller.playOrPause.bind(controller)}
        />
      )}
      <Action
        icon={IoPlaySkipBackSharp}
        label="Go back to the beginning"
        onClick={controller.goToBeginning.bind(controller)}
      />
      <Action
        icon={IoPlayBackSharp}
        onClick={controller.goBackwardsByMeasure.bind(controller)}
      />
      <Action 
        icon={IoPlayForwardSharp}
        onClick={controller.goForwardsByMeasure.bind(controller)}
      />
    </div>
  )
}
