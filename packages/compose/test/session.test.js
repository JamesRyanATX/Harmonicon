import { SessionModel } from '@composer/core';
import { session, SessionComposer } from '../';

describe('session', function () {
  it('creates a session', async function () {
    const result = await session('my-song', async ({ session }) => {
      session.at(0, 0, 0).meter([ 4, 4 ]);
      session.at(0, 0, 0).tempo(100);
      session.at(0, 0, 0).swing(0.4);
      session.at(0, 0, 0).key('c');
      session.at(0, 0, 0).scale('major');
    });

    expect(result).toBeInstanceOf(SessionComposer);
    expect(result.model).toBeInstanceOf(SessionModel);
    expect(result.model.events.length).toEqual(5);
  });
});