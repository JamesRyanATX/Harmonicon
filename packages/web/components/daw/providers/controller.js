import { createContext, useContext } from 'react';

export const ControllerContext = createContext({});

export function useController() {
  return useContext(ControllerContext)
}