import { Harmonicon } from '@composer/core';

export function useMidi() {
  return Harmonicon.drivers.midi;
}