import styles from '../../../styles/daw.tabs.module.css';
import { IoAddSharp, IoCloseSharp } from "react-icons/io5";
import { Editable } from '../controls/editable';

export function Tab({
  label = null,
  icon = null,
  onIconClick = () => {},
  onTabClick = () => {},
  onCloseClick = () => {},
  onRename = () => {},
  selected = false,
  close = true,
  children,
}) {
  const Icon = icon || null;

  return (
    <div
      onClick={(e) => {
        if (!selected) {
          onTabClick(e)
        }
      }}
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
            <a 
              className={styles.tabLabel}
            >
              {selected ? (
                <Editable
                  value={label}
                  onChange={onRename}
                />
              ) : label}
            </a>
          ) : ''}
          {close ? (
            <a 
              className={styles.tabClose}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCloseClick()
              }}
            >
              <IoCloseSharp/>
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