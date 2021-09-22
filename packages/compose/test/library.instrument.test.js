import { Harmonicon } from '@composer/core';
import { library, session } from '../';

describe('library.instrument', function () {

  afterEach(() => {
    Harmonicon.uninstall('test');
  })

  it('creates an instrument', function () {
    const composer = library('test', function ({ library }) {
      library.instrument('bass', function () {
        return 'i am instrument';
      });
    });

    expect(composer.model.instruments.length).toEqual(1);
    expect(composer.model.instruments.first().name).toEqual('bass');
  });

  describe('in sessions', function () {

    async function sessionWithLibraryInstrument(fn) {
      
      // Create a library
      const libraryComposer = library('test', function ({ library }) {
        library.instrument('bass', function () {
          return 'i am instrument';
        });
      });

      await Harmonicon.install(libraryComposer);

      // Create a session that uses something from the library
      const sessionComposer = session('test', fn);

      return {
        session: sessionComposer,
        library: libraryComposer,
        instruments: sessionComposer.model.instruments,
      }
    }

    describe('explicit use', function() {
      it('loads', async function () {
        const { instruments } = await sessionWithLibraryInstrument(({ session }) => {
          session.use.instrument('bass').from.library('test');
        });

        expect(instruments.length).toEqual(1);
        expect(instruments.at(0).name).toEqual('bass');
      });
    });

    describe('implicit use', function() {
      it('loads', async function () {
        const { instruments } = await sessionWithLibraryInstrument(({ session }) => {
          session.use.instrument('bass').from.library();
        });

        expect(instruments.length).toEqual(1);
        expect(instruments.at(0).name).toEqual('bass');
      });
    });

    describe('low level use', function() {
      it('loads', async function () {
        const { instruments } = await sessionWithLibraryInstrument(({ session }) => {
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