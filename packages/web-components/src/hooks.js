import { useEffect } from 'react';

export function useEventListener(obj, event, fn) {
  useEffect(() => {
    obj.on(event, fn);

    return () => { obj.off(event, fn);  }
  }, [ obj ]);
}