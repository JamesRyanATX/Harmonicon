import { Component, useEffect, useState } from 'react';
import { StorageDriverAuthorizationError } from '@composer/core';
import { useErrorBoundary } from '@composer/daw-components';
import { config } from '../lib/config';

const handlers = [

  // Catch Dropbox authorization error
  (error) => {
    if (
      error &&
      error instanceof StorageDriverAuthorizationError &&
      config.get('storage') === 'dropbox'
    ) {
      config.set('storage', 'localstorage');
      
      window.location = '/?action=dropbox-expired';
    }
  },

  // Generic handler
  (error) => {
    throw error;
    return true;
  }

];

export function Errors({
  children = null,
}) {
  const [ syncError, setSyncError ] = useErrorBoundary();
  const [ asyncError, setAsyncError ] = useState();

  function onUnhandledRejection(event) {
    setAsyncError(event.reason);
  }

  useEffect(() => {
    window.addEventListener('unhandledrejection', onUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    }
  }, []);

  const error = syncError || asyncError || null;

  if (error) {
    handlers.reduce((handled, handler) => {
      if (!handled && handler(error)) {
        return true;
      }
      else {
        return handled;
      }
    }, false);

    return (
      <div>OH NO</div>
    );
  }
  else {
    return children;
  }
}