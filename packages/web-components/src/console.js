import React, { useState, useEffect, createContext, useContext } from 'react';
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

export const ConsoleContext = createContext({});

export function useConsoleLogs() {
  return useContext(ConsoleContext)
}

export function Console({
  level = 'debug',
  levelFilters = defaultLevelFilters,
}) {
  const { logs, setLogs } = useConsoleLogs();

  return (
    <div className={styles.console}>
      <ConsoleFeed logs={logs} filter={levelFilters[level]} variant="dark" />
    </div>
  )
}

export function ConsoleProvider({
  target = null,
  children = null
} = {}) {
  const [ logs, setLogs ] = useState([]);

  useEffect(() => {
    Hook(target, (log) => setLogs((currLogs) => [...currLogs, log]), false);

    return () => {
      setLogs([]);
      Unhook(target)
    }
  }, [ target ]);

  const ctx = { logs, setLogs };

  return (
    <ConsoleContext.Provider value={ctx}>
      {children}
    </ConsoleContext.Provider>
  );
}