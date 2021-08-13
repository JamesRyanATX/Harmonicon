import {
  session,
} from '@composer/compose';

session('000-composition', async ({ session }) => {
  session.at(0, 0, 0).meter([ 4, 4 ]);
  session.at(0, 0, 0).tempo(100);
  session.at(0, 0, 0).swing(0.4);
  session.at(0, 0, 0).key('c');
  session.at(0, 0, 0).scale('major');
});

