import { Logo } from './transport/logo';
import { Actions } from './transport/actions';
import { Timeline } from './transport/timeline';
import { Display } from './transport/display';

import styles from '../../styles/daw.transport.module.css';

export function Transport ({ controller }) {
  return (
    <div className={styles.transport}>
      <Logo controller={controller} />
      <Actions controller={controller} />
      <Timeline controller={controller} />
      <Display controller={controller} />
    </div>
  )
}