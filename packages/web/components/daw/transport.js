import { Display } from './transport/display';
import { Actions } from './transport/actions';
import { Logo } from './transport/logo';

import styles from '../../styles/daw.transport.module.css';

export function Transport ({ controller }) {
  return (
    <div className={styles.transport}>
      <Logo controller={controller} />
      <Actions controller={controller} />
      <Display controller={controller} />
    </div>
  )
}