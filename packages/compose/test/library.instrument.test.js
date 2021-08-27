import { library, session, SessionComposer } from '../';

describe('library.instrument', function () {

  it('creates an instrument', async function () {
    const composer = await library('test', async function ({ library }) {
      library.instrument('bass', async function () {
        return 'i am instrument';
      });
    });

    expect(composer.model.instruments.length).toEqual(1);
    expect(composer.model.instruments.first().name).toEqual('bass');
  });

  it('can be used in sessions', async function () {

    // Create a library
    const libraryComposer = await library('test', async function ({ library }) {
      library.instrument('bass', async function () {
        return 'i am instrument';
      });
    });

    // Expose library to session composer
    await SessionComposer.use({
      name: 'test',
      build: () => (libraryComposer)
    });

    // Create a session that uses something from the library
    const sessionComposer = await session('test', async function ({ session }) {
      session.use.instrument('bass').from.library('test');
    });

    expect(sessionComposer.model.instruments.length).toEqual(1);

    const instrument = sessionComposer.model.instruments.first();

    expect(instrument.name).toEqual('bass');
    expect(instrument.name).toEqual('bass');

  });
});