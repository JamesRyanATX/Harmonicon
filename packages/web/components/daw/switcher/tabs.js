import styles from '../../../styles/daw.tabs.module.css';
import { IoAddSharp, IoEllipsisVerticalSharp } from "react-icons/io5";


export function Tab({
  label = null,
  icon = null,
  onIconClick = () => {},
  onTabClick = () => {},
  onMenuClick = () => {},
  selected = false,
  menu = true,
  children,
}) {
  const Icon = icon || null;

  return (
    <div
      onClick={onTabClick}
      className={[
        styles.tab,
        selected ? styles.tabIsSelected : styles.tabIsUnselected
      ].join(' ')}
    >
      {children ? children : (
        <div>
          {icon ? (
            <a
              className={styles.tabIcon}
              onClick={onIconClick}
            >
              <Icon />
            </a>
          ) : ''}
          {label ? (
            <span className={styles.tabLabel}>
              {label}
            </span>
          ) : ''}
          {menu ? (
            <a 
              className={styles.tabMenu}
              onClick={onMenuClick} 
            >
              <IoEllipsisVerticalSharp/>
            </a>
          ) : ''}
        </div>
      )}
    </div>
  )
}

export function NewTab ({
  onClick = () => {}
}) {
  return (
    <Tab onTabClick={onClick}>
      <IoAddSharp />
    </Tab>
  )
}

export function TabSpace () {
  return (
    <div className={styles.tabSpace} />
  )
}

export function Tabs ({ children }) {
  return (
    <div className={styles.tabs}>
      {children}
    </div>
  )
}