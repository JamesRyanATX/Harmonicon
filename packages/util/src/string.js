import { nanoid } from 'nanoid';

export function generateIdentifier() {
  return nanoid(8);
}