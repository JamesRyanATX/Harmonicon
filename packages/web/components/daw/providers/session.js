import { createContext, useContext } from 'react';
import { useState, useEffect } from "react";
import { useLogger } from './logger';
import { parseCode } from '@composer/compose';


export const SessionContext = createContext({});

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({
  file = null,
  children,
}) {
  const logger = useLogger('SessionProvider');
  const [ session, setSession ] = useState();

  // function parseFile() {
  //   logger.debug(`parsing ${file.name}`);

  //   try {
  //     const results = parseCode(file.source);
  //   }
  //   catch (e) {
  //     // console.error(e);
  //     // console.error(e);
  //     logger.error(e);
  //   }
  // }

  // function onComposerParsed(composer) {
  //   logger.info(`parsed ${file.name}`)
  //   setSession(composer.model);
  // }

  // // Assign model object when parse finishes
  // useEffect(() => {
  //   Harmonicon.on('composer:parsed', onComposerParsed);

  //   return () => {
  //     Harmonicon.off('changed:source', onComposerParsed);
  //   };
  // }, []);

  // // Create new session object when file changes
  // useEffect(() => {
  //   parseFile();
  //   file.on('changed:source', parseFile);

  //   return () => {
  //     file.off('changed:source', parseFile);
  //   };
  // }, [ file ]);

  logger.debug('render')

  return file ? (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  ) : '';
}