import { useState } from 'react';
import { Logger } from "@composer/util";
import { Harmonicon } from "@composer/core";
import { ConsoleProvider } from '@composer/daw-components';

export function useLogger(name) {
  const [ logger ] = useState(new Logger(`Web.${name}`));

  return logger;
}

export function LoggerProvider({
  children = null
}) {
  return (
    <ConsoleProvider target={Harmonicon.console}>
      {children}
    </ConsoleProvider>
  );
}