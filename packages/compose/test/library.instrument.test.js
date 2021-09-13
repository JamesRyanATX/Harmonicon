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

  describe('in sessions', function () {

    async function sessionWithLibraryInstrument(fn) {
      
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
      const sessionComposer = await session('test', fn);

      return {
        session: sessionComposer,
        library: libraryComposer,
        instruments: sessionComposer.model.instruments,
      }
    }

    describe('explicit use', function() {
      it('loads', async function () {
        const { instruments } = await sessionWithLibraryInstrument(async ({ session }) => {
          session.use.instrument('bass').from.library('test');
        });

        expect(instruments.length).toEqual(1);
        expect(instruments.at(0).name).toEqual('bass');
      });
    });

    describe('implicit use', function() {
      it('loads', async function () {
        const { instruments } = await sessionWithLibraryInstrument(async ({ session }) => {
          session.use.instrument('bass').from.library();
        });

        expect(instruments.length).toEqual(1);
        expect(instruments.at(0).name).toEqual('bass');
      });
    });

    describe('low level use', function() {
      it('loads', async function () {
        const { instruments } = await sessionWithLibraryInstrument(async ({ session }) => {
          session.use({
            collection: 'instruments',
            libraryName: 'test',
            source: 'library',
            name: 'bass',
            composer: 'instrument'
          });
        });

        expect(instruments.length).toEqual(1);
        expect(instruments.at(0).name).toEqual('bass');
      });
    });
  });
});