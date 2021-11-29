import { config } from '../src/config';

describe('config', function () {

  it('defines a base configuration', async function () {
    expect(config.drivers).toEqual({
      audio: null,
      storage: null,
      midi: null
    });

    expect(config.dropbox).toEqual({
      clientId: expect.any(String),
      prefix: expect.any(String),
    });

    expect(config.libraries).toEqual({});
    expect(config.pitchAliases).toEqual({});
  });

});