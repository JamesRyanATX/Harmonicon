import React, { useState } from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';
import styles from '../styles/menu.module.css';

function MenuItemDropdown({
  children = null,
  active = false,
}) {
  return (
    <div className={[
      styles.dropdown,
      active ? styles.dropdownIsActive : '',
    ].join(' ')}>
      {children}
    </div>
  )
}

export function MenuDropdownItem({
  label = null,
  href = null,
  tooltip = null,
  icon = null,
  disabled = false,
  onClick = () => (true),
}) {
  return (
    <div className={[
      styles.dropdownItem,
      disabled ? styles.dropdownItemIsDisabled : '',
    ].join(' ')}>
      <a href={href} onClick={onClick} title={tooltip} target={href ? '_blank' : ''}>
        <span>
          {icon ? icon() : ''}
        </span>
        <span>
          {label}
        </span>
      </a>
    </div>
  )
}

export function MenuDropdownDivider({
}) {
  return (
    <div className={styles.dropdownDivider} />
  )
}

export function MenuDropdownMask({
  active = false,
  onClick = () => {},
}) {
  return (
    <div 
      className={[
        styles.dropdownMask,
        active ? styles.dropdownMaskIsActive : ''
      ].join(' ')}
      onClick={onClick}
    />
  )
}

export function MenuDropdownHeader({
  label = null
}) {
  return (
    <div className={styles.dropdownHeader}>
      {label}
    </div>
  )
}

export function MenuItem({
  href = null,
  label = null,
  tooltip = null,
  children = null,
  dropdown = null,
  active = false,
  onClick = () => (true),
}) {
  return (
    <div onClick={onClick} className={[
      styles.item,
    ].join(' ')}>
      {children ? children : (
        <a title={tooltip}>
          {label}
          <IoChevronDownSharp />
        </a>
      )}
      {(dropdown) ? (
        <MenuItemDropdown active={active}>
          {dropdown()}
        </MenuItemDropdown>
      ) : ''}
    </div>
  )
}

export function Menu({
  children = null,
  before = () => (''),
  after = () => (''),
  items = [],
  className = ''
}) {
  const [ active, setActive ] = useState(null);

  return (
    <div className={[
      styles.menu,
      className,
    ].join(' ')}>
      {before ? before() : ''}
      {items.map((item) => (
        <MenuItem
          key={item.label}
          label={item.label}
          dropdown={item.dropdown}
          active={active === item.label}
          onClick={() => {
            setActive(active === item.label ? null : item.label)
          }}
        />
      ))}
      <div 
        onClick={() => (setActive(null))}
        style={{ flex: 1 }} 
      />
      {children}
      {after ? after() : ''}
      <MenuDropdownMask 
        onClick={() => (setActive(null)) }
        active={!!active} 
      />
    </div>
  )
}