import { useState, useEffect } from 'react';
import { IoLogoDropbox } from 'react-icons/io5';
import { DialogModal, useLocationHash } from '@composer/daw-components';
import { config } from '../../../../lib/config';

import * as DropboxStorageDriver from '@composer/driver-storage-dropbox';
import { useController } from '../../../providers/controller';

function createDriver(accessToken) {
  return new DropboxStorageDriver.Driver({
    clientId: config.core.dropbox.clientId,
    prefix: config.core.dropbox.prefix,
    applicationUrl: document.location.origin,
    accessToken,
  });
}


function ConnectingModal({ 
  onCancel = () => {}
}) {
  return (
    <DialogModal
      title="Dropbox Setup"
      text="Testing connection; one moment..."
      icon={IoLogoDropbox}
      buttons={[]}
      working
    />
  )
}

function FailureModal({ 
  onAuthorize = () => {},
  onCancel = () => {}
}) {
  return (
    <DialogModal
      title={"Connection Failed"}
      text={"Unable to verify connection to Dropbox.  Do you want to retry?"}
      icon={IoLogoDropbox}
      buttons={[
        {
          label: 'Retry',
          onClick: onAuthorize,
          primary: true,
        },
        {
          label: 'Cancel',
          onClick: onCancel
        },
      ]}
    />
  )
}

function PreauthorizeModal({ 
  onAuthorize = () => {},
  onCancel = () => {}
}) {
  return (
    <DialogModal
      title={"Switch to Dropbox"}
      text={"Would you like to connect your Dropbox account and store music in the cloud?"}
      icon={IoLogoDropbox}
      buttons={[
        {
          label: 'Connect to Dropbox',
          onClick: onAuthorize,
          primary: true,
        },
        {
          label: 'Cancel',
          onClick: onCancel
        },
      ]}
    />
  )
}

function ReauthorizeModal({ 
  onAuthorize = () => {},
  onCancel = () => {}
}) {
  return (
    <DialogModal
      title={"Reconnect to Dropbox"}
      text={"Your Dropbox connection has expired.  Would you like to reconnect?"}
      icon={IoLogoDropbox}
      buttons={[
        {
          label: 'Reconnect to Dropbox',
          onClick: onAuthorize,
          primary: true,
        },
        {
          label: 'Cancel',
          onClick: onCancel
        },
      ]}
    />
  )
}

export function SwitchToDropboxModal({
  reauthorize = false
}) {
  const controller = useController();
  const locationHash = useLocationHash();
  const accessToken = locationHash.params.access_token;

  const [ failure, setFailure ] = useState(false);
  const [ driver, setDriver ] = useState(createDriver(accessToken));

  useEffect(() => {

    async function connect() {
      try {
        const refreshedToken = await driver.refreshToken();
        await driver.list();

        config.set('storage', 'dropbox');
        config.set('dropbox.accessToken', refreshedToken);

        window.location = '/';
      }
      catch (e) {
        console.error(e);
        setFailure(true);
      }
    }

    if (accessToken && !failure) {
      connect();
    }
  });

  async function onAuthorize() {
    window.location = await driver.getAuthenticationUrl({
      returnPath: '/?action=switch-to-dropbox'
    });
  }

  function onCancel() {
    controller.emit('modal:close');
  }

  if (failure) {
    return <FailureModal onAuthorize={onAuthorize} onCancel={onCancel} />
  }
  else if (accessToken) {
    return <ConnectingModal onCancel={onCancel} />
  }
  else if (reauthorize) {
    return <ReauthorizeModal onAuthorize={onAuthorize} onCancel={onCancel} />
  }
  else {
    return <PreauthorizeModal onAuthorize={onAuthorize} onCancel={onCancel} />
  }
}