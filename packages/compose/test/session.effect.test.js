import { session } from '../';

describe('effect', function () {
  it('creates an effect', async function () {
    const result = await session('my-song', async function ({ session }) {
      session.effect('reverb', () => (true));
    });

    expect(result.model.effects.length).toEqual(1);
  });
});