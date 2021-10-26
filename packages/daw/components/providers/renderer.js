import { useState } from 'react';
import { useEventListener } from '@composer/daw-components';
import { useController } from './controller';

export function useRenderer() {
  const controller = useController();
  const [ renderer, setRenderer ] = useState(null);

  function clearRenderer() {
    setRenderer()
  }

  useEventListener(controller, 'composer:rendered', setRenderer);
  useEventListener(controller, 'file:selected', clearRenderer);

  return renderer;
}