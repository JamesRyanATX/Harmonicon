import styles from '../../../styles/daw.tabs.module.css';

export function Logo({
  logo = null,
  size = 'small',
}) {
  const Logo = logo;

  return (
    <div className={styles.logo}>
      <Logo size={size} />
    </div>
  )
}