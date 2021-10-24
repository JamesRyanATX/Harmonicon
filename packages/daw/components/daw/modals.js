import { useState } from 'react';
import { useController } from './providers/controller';

export function Modals() {
  const [ modal, setModal ] = useState();
  const controller = useController();

  controller.on('modal:open', ({ component, props }) => {
    setModal({ component, props });
  });

  controller.on('modal:close', () => {
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