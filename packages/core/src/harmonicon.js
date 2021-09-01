import { eventify } from '@composer/util';

export const Harmonicon = eventify({
  version: 'FORGIVE-ME'
});

// Composer events
Harmonicon.allow('composer:error');
Harmonicon.allow('composer:parsing');
Harmonicon.allow('composer:parsed');
Harmonicon.allow('composer:rendering');
Harmonicon.allow('composer:rendered');

if (typeof window !== 'undefined') {
  window.Harmonicon = Harmonicon;
}