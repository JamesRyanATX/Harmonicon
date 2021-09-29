import React, { useState, useEffect } from 'react';
import { Hook, Console as ConsoleFeed, Unhook } from 'console-feed'

import styles from '../styles/console.module.css';

const defaultLevelFilters = {
  debug: [
    'log',
    'debug',
    'info',
    'warn',
    'error',
  ],
  info: [
    'info',
    'warn',
    'error',
  ],
  warn: [
    'warn',
    'error',
  ],
  error: [
    'error'
  ],
}

export function Console({
  target = null,
  level = 'debug',
  levelFilters = defaultLevelFilters,
  logs = [],
  setLogs = () => {},
}) {
  useEffect(() => {
    Hook(target, (log) => setLogs((currLogs) => [...currLogs, log]), false);
    return () => Unhook(target)
  }, []);

  return (
    <div className={styles.console}>
      <ConsoleFeed logs={logs} filter={levelFilters[level]} variant="dark" />
    </div>
  )
}