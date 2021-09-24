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

    describe('imported as string', function () {
      useTestLibrary({
        instrument: () => ('bananarama')
      });

      it('matches complete references', async function () {
        const composer = session('my-song', function ({ session }) {
          session.use('test.instrument.test');
        });
  
        const instrument = composer.model.instruments.first();

        expect(instrument.name).toEqual('test');
      });

      it('autodetects library name', async function () {
        const composer = session('my-song', function ({ session }) {
          session.use('instrument.test');
        });
  
        const instrument = composer.model.instruments.first();

        expect(instrument.name).toEqual('test');
      });
    });

    describe('aliasing', function () {
      useTestLibrary({
        instrument: () => ('bananarama')
      });

      it('aliases the instrument', async function () {
        const composer = session('my-song', function ({ session }) {
          session.use.instrument('test').from.library('test')
            .as('bananarama');
        });
  
        const instrument = composer.model.instruments.first();

        expect(instrument.name).toEqual('bananarama');
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

    describe('aliasing', function () {
      useTestLibrary({
        effect: () => ('bananarama')
      });

      it('aliases the effect', async function () {
        const composer = session('my-song', function ({ session }) {
          session.use.effect('test').from.library('test')
            .as('bananarama');
        });
  
        const effect = composer.model.effects.first();

        expect(effect.name).toEqual('bananarama');
      });
    });

  });

});
