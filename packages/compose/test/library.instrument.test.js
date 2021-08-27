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

  it('exposes itself to other sessions', async function () {

    // Create a library
    const libraryComposer = await library('test', async function ({ library }) {
      library.instrument('bass', async function () {
        return 'i am instrument';
      });
    });

    // Expose library to session composer
    SessionComposer.use(libraryComposer.model);

    // Create a session that uses something from the library
    const sessionComposer = await session('test', async function ({ session }) {
      session.import.instrument('bass').from.library('test');
    });

    expect(sessionComposer.model.instruments.length).toEqual(1);

    const instrument = sessionComposer.model.instruments.first();
console.log(instrument.fn.toString());
    expect(instrument.name).toEqual('bass');
    expect(instrument.name).toEqual('bass');

  });
});