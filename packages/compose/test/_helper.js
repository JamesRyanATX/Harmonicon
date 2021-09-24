import { Harmonicon } from '@composer/core';
import { library } from '../src/library';

export async function installTestLibrary({
  instrument = null,
  effect = null
}) {
  const testLibrary = library('test', ({ library }) => {
    if (instrument) {
      library.instrument('test', instrument);
    }
    if (effect) {
      library.effect('test', effect);
    }
  });

  return Harmonicon.install(testLibrary);
}

export function uninstallTestLibrary() {
  return Harmonicon.uninstall('test');
}

export function useTestLibrary(options) {
  beforeEach(async () => {
    return installTestLibrary(options);
  });

  afterEach(async function() {
    return uninstallTestLibrary();
  })
}
