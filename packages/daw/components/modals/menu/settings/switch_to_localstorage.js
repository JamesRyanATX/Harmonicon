import { DialogModal } from '@composer/daw-components';
import { useController } from '../../../providers/controller';
import { config } from '../../../../lib/config';

export function SwitchToLocalstorageModal() {
  const controller = useController();

  async function onConfirm() {
    config.set('storage', 'localstorage');
    config.unset('dropbox.accessToken');

    window.location = '/';
  }

  function onCancel() {
    controller.emit('modal:close');
  }

  return (
    <DialogModal
      title={"Switch to Local Storage"}
      text={"Are you sure you want to switch back to Local Storage? Your sessions will only be available in this browser."}
      buttons={[
        {
          label: 'Switch to Local Storage',
          onClick: onConfirm,
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