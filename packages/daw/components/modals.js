import { useState } from 'react';
import { useEventListener } from '@composer/daw-components';
import { useController } from './providers/controller';

export function Modals() {
  const [ modal, setModal ] = useState();
  const controller = useController();

  useEventListener(controller, 'modal:open', function onModalOpen({ component, props = {} }) {
    if (component) {
      setModal({ component, props });
    }
    else {
      setModal({ component: arguments[0], props: {} });
    }
  });

  useEventListener(controller, 'modal:close', function onModalClose() {
    setModal(null);
  });

  if (modal) {
    return <modal.component {...modal.props} onClose={() => {
      controller.emit('modal:close')
    }} />;
  }
  else {
    return '';
  }
}