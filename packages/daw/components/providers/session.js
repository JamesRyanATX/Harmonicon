import { createContext, useContext } from 'react';
import { useState, useEffect } from "react";
import { useLogger } from './logger';
import { useFile } from './file';
import { parse } from '@composer/compose';


export const SessionContext = createContext({});

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({
  children,
}) {
  const file = useFile();
  const logger = useLogger('SessionProvider');
  const [ session, setSession ] = useState();

  // Create session when file is loaded
  useEffect(() => {
    (async function parseFile() {
      try {
        if (file) {
          setSession(controller.session = (await parse({ code: file.source })).model);
        }
      }
      catch (e) {
        logger.error(e);
      }
    })();
  }, [ file, logger ]);

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

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}