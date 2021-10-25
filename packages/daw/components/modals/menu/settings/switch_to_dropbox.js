import { useState, useEffect } from 'react';
import { ConfirmModal, DialogModal, useLocationHash } from '@composer/daw-components';
import { Task } from '@composer/util';
import { config } from '@composer/core';
import * as DropboxStorageDriver from '@composer/driver-storage-dropbox';
import { useController } from '../../../providers/controller';

function createDriver(accessToken) {
  return new DropboxStorageDriver.Driver({
    clientId: config.dropbox.clientId,
    prefix: config.dropbox.prefix,
    applicationUrl: document.location.origin,
    accessToken,
  });
}

function ConnectedModal({
  onSelect = () => {},
  onCancel = () => {},
}) {
  return (
    <DialogModal
      title={"Dropbox Setup"}
      text={"Verified.  Would you like to use Dropbox for file storage?"}
      buttons={[
        {
          label: 'Yes, Switch to Dropbox',
          onClick: onSelect,
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

function ConnectingModal({ 
  onCancel = () => {}
}) {
  return (
    <DialogModal
      title="Dropbox Setup"
      text="Testing connection; one moment..."
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

function PreauthModal({ 
  onAuthorize = () => {},
  onCancel = () => {}
}) {
  return (
    <DialogModal
      title={"Switch to Dropbox"}
      text={"Would you like to connect your Dropbox account and store music in the cloud?"}
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

export function SwitchToDropboxModal() {
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

        localStorage.setItem('harmonicon.storage', 'dropbox');
        localStorage.setItem('harmonicon.dropbox.accessToken', refreshedToken);

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
  else {
    return <PreauthModal onAuthorize={onAuthorize} onCancel={onCancel} />
  }
}