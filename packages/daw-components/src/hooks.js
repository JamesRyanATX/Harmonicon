import React, { useEffect, useRef } from 'react';

export function useLocationParams() {

  function parse() {
    const urlParams = new URLSearchParams(window.location.search);

    return Array.from(urlParams.entries())
      .reduce((params, [ param, value ]) => {
        return { ...params, [param]: value };
      }, {});
  }

  return {
    params: parse(),
  }
}

export function useLocationHash() {

  function parse() {
    const locationHash = window.location.hash.replace(/^#/, '');
    const urlParams = new URLSearchParams(locationHash);

    return Array.from(urlParams.entries())
      .reduce((params, [ param, value ]) => {
        return { ...params, [param]: value };
      }, {});
  }

  return {
    params: parse(),
  }
}

export function useViewport() {
  const [ width, setWidth ] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    }
  }, []);

  return { width };
}

/**
 * Hook for simplifying load/unload event callbacks.
 * 
 * @param {object} obj 
 * @param {string} event 
 * @param {function} fn 
 */
export function useEventListener(obj, event, originalFn) {
  const mounted = useRef(false);
  const fn = function () {
    if (!mounted.current) {
      console.warn(`[useEventListener] ${event} => ${originalFn.name}() halted (unmounted client).`)
    }
    else {
      originalFn.apply(this, arguments);
    }
  };

  fn.originalFn = originalFn;

  // if (!originalFn.name) {
  //   console.warn(`[useEventListener] ${event} => fn() is anonymous, this may create a memory leak.`);
  // }

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    }
  }, []);

  useEffect(() => {
    obj.on(event, fn);

    return () => {
      if (obj.listeners[event].indexOf(fn) === -1) {
        console.warn(`[useEventListener] ${event} not found during unmount.`)
      }
      obj.off(event, fn);
    }
  }, [ obj ]);

}