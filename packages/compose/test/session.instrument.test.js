import { session } from '../';

describe('instrument', function () {
  it('creates an instrument', async function () {
    await session('my-song', async function ({ session }) {
      session.instrument('bass', async function () {
        return 'i am instrument';
      });

      expect(session.model.instruments.length).toEqual(1);
    });
  });
});