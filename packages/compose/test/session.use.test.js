import { session } from '../';
import { useTestLibrary } from './_helper';

describe('session#use', function () {

  describe('instruments', function () {

    function composeTestInstrument(options) {
      const composer = session('my-song', function ({ session }) {
        session.use.instrument('test', options).from.library('test');
      });

      return composer.model.instruments.first();
    }

    describe('defined in long form', function () {
      useTestLibrary({
        instrument: ({ instrument }) => {
          instrument.fn((options) => (options));
        }
      });

      it('imports the instrument', async function () {
        const instrument = composeTestInstrument({ banana: 'rama' });

        expect(await instrument.render()).toEqual({
          banana: 'rama'
        });
      });
    });

    describe('defined in short form', function () {
      useTestLibrary({
        instrument: () => ('bananarama')
      });

      it('imports the instrument', async function () {
        const instrument = composeTestInstrument({ banana: 'rama' });

        expect(await instrument.render()).toEqual('bananarama');
      });
    });
  });

  describe('effects', function () {

    function composeTestEffect(options) {
      const composer = session('my-song', function ({ session }) {
        session.use.effect('test', options).from.library('test');
      });

      return composer.model.effects.first();
    }

    describe('defined in long form', function () {
      useTestLibrary({
        effect: ({ effect }) => {
          effect.fn((options) => (options));
        }
      });

      it('imports the effect', function () {
        const effect = composeTestEffect({ banana: 'rama' });

        expect(effect.render()).toEqual({
          banana: 'rama'
        });
      });
    });

    describe('defined in short form', function () {
      useTestLibrary({
        effect: () => ('bananarama')
      });

      it('imports the effect', function () {
        const effect = composeTestEffect({ banana: 'rama' });

        expect(effect.render()).toEqual('bananarama');
      });
    });

  });

});
