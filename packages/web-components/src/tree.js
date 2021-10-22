import React, { useState } from 'react';
import { IoChevronDownSharp, IoChevronForwardSharp } from 'react-icons/io5';

import styles from '../styles/tree.module.css';

export function TreeItem({
  label = 'Item',
  description = null,
  icon = () => {},
  onClick = () => {},
  actions = () => {}
}) {
  return (
    <div className={styles.treeItem} onClick={onClick}>
      <span className={styles.treeItemIcon}>
        {icon()}
      </span>
      <span className={styles.treeItemLabel}>
        {label}
      </span>
      <span className={styles.treeItemDescription}>
        {description}
      </span>
      <span className={styles.treeItemActions}>
        {actions()}
      </span>

    </div>
  )
}

export function TreeGroupItems({
  children = null
}) {
  return (
    <div className={styles.treeGroupItems}>
      {children}
    </div>
  )
}

export function TreeGroup({
  label = 'Group',
  children = null,
}) {
  const [ open, setOpen ] = useState(false);

  return (
    <div className={[
      styles.treeGroup,
      open ? styles.treeGroupIsOpen : '',
    ].join(' ')}>
      <TreeItem
        onClick={() => (setOpen(!open))}
        icon={open ? IoChevronDownSharp : IoChevronForwardSharp}
        label={label}
      />
      <TreeGroupItems>
        {children}
      </TreeGroupItems>
    </div>
  )
}

export function Tree({
  children = null
}) {
  return (
    <div className={styles.tree}>
      {children}
    </div>
  )
}