import { createContext, useContext } from 'react';

export const FileContext = createContext({});

export function useFile(onChangeEffect) {
  return useContext(FileContext)
}

export function FileProvider({
  children = null,
  file = null
} = {}) {
  return (
    <FileContext.Provider value={file}>
      {children}
    </FileContext.Provider>
  )
}