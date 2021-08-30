import { build } from "../";
import { session } from "@composer/compose";

describe('@composer/library-core', function () {

  describe('build', function () {
    it('contains all instruments', async function () {
      const library = await build();

      expect(library.model.instruments.length).toEqual(22);
    });  
  });

  describe('usage', function () {
    it('can be used in a session file', async function () {
      const composer = await session('test-session', async ({ session }) => {
        session.use.instrument('electric-bass').from.library('core');
      });

      expect(composer.model.instruments.length).toEqual(1);
    });
  });

});