import { createContext, useContext } from 'react';

export const FileContext = createContext({});

export function useFile(onChangeEffect) {
  return useContext(FileContext)
}