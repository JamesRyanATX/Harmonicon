import { build } from "../";
import { session } from "@composer/compose";
import { Harmonicon } from "@composer/core";

describe('@composer/library-core', function () {
  let library;

  beforeEach(async () => {
    return Harmonicon.install(library = await build());
  });

  afterEach(() => {
    Harmonicon.uninstall('core');
  })

  function getEffect(name) {
    return library.model.effects.filterByProperty('name', name)[0];
  }

  describe('build', function () {
    it('contains all instruments', async function () {
      const library = await build();

      expect(library.model.instruments.length).toEqual(31);
      expect(library.model.effects.length).toEqual(8);
      expect(library.model.templates.length).toEqual(2);
      expect(library.model.snippets.length).toEqual(1);
      expect(library.model.demos.length).toEqual(1);
    });  
  });

  describe('usage', function () {
    it('can be used in a session file', function () {
      const composer = session('test-session', ({ session }) => {
        session.use.instrument('electric-bass').from.library('core');
      });

      expect(composer.model.instruments.length).toEqual(1);
    });
  });

  describe('effects', function () {
    describe('reverb', function () {
      it('is defined', function () {
        const name = 'reverb';
        const effect = getEffect(name);

        expect(effect.url).toEqual('https://tonejs.github.io/');
        expect(effect.documentationUrl).toEqual(expect.any(String));
        expect(effect.author).toEqual('Harmonicon');
        expect(effect.group).toEqual('Generic');
        expect(effect.defaultOptions).toEqual({
          decay: 0.5,
          preDelay: 0,
          wet: 0.5
        });
      })
    })
  })

});