import { Harmonicon } from '@composer/core';
import { library, session, SessionComposer } from '../';

describe('library.effect', function () {

  afterEach(() => {
    Harmonicon.uninstall('test');
  })

  it('creates an effect', function () {
    const composer = library('test', function ({ library }) {
      library.effect('reverb', function () {
        return 'i am reverb';
      });
    });

    expect(composer.model.effects.length).toEqual(1);
    expect(composer.model.effects.first().name).toEqual('reverb');
  });

  it('is exposed to other sessions', async function () {

    // Create a library
    const libraryComposer = library('test', function ({ library }) {
      library.effect('reverb', function () {
        return 'i am reverb';
      });
    });

    // Expose library to session composer
    await Harmonicon.install(libraryComposer);

    // Create a session that uses something from the library
    const sessionComposer = session('test', function ({ session }) {
      session.use.effect('reverb').from.library('test');
    });

    expect(sessionComposer.model.effects.length).toEqual(1);
    expect(sessionComposer.model.effects.first().name).toEqual('reverb');

  });
});