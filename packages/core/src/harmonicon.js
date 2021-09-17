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

// Register note events
[ 0, 1, 2, 3, 4, 5, 6, 7 ].forEach((octave) => {
  [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ].forEach((pitch) => {
    Harmonicon.allow(`play:${pitch}${octave}`);
    Harmonicon.allow(`play:${pitch}b${octave}`);
    Harmonicon.allow(`play:${pitch}#${octave}`);
  })
});

Harmonicon.allow('play:c4');

if (typeof window !== 'undefined') {
  window.Harmonicon = Harmonicon;
}