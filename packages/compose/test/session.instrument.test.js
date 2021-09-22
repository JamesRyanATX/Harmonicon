import { session } from '../';

describe('instrument', function () {
  it('creates an instrument', function () {
    session('my-song', function ({ session }) {
      session.instrument('bass', function () {
        return 'i am instrument';
      });

      expect(session.model.instruments.length).toEqual(1);
    });
  });
});