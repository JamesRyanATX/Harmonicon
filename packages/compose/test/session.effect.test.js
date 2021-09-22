import { session } from '../';

describe('effect', function () {
  it('creates an effect', function () {
    const result = session('my-song', function ({ session }) {
      session.effect('reverb', () => (true));
    });

    expect(result.model.effects.length).toEqual(1);
  });
});