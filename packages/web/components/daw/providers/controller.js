import { createContext, useContext } from 'react';
import { useLogger } from './logger';

export const ControllerContext = createContext({});

export function useController() {
  return useContext(ControllerContext)
}

export function ControllerProvider({
  controller = null,
  children = null,
}) {
  const logger = useLogger('ControllerProvider');

  logger.debug('render');

  return (
    <ControllerContext.Provider value={controller}>
      {children}
    </ControllerContext.Provider>
  )
}