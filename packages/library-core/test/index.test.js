import { build, install } from "../";
import { SessionComposer, session } from "@composer/compose";

describe('@composer/library-core', function () {

  describe('build', function () {
    it('contains all instruments', async function () {
      const library = await build();

      expect(library.model.instruments.length).toEqual(21);
    });  
  });

  describe('install', function () {
    it('installs library', async function () {
      const library = await install();

      expect(SessionComposer.libraries.core).toBeTruthy();
    });  
  });

  describe('usage', function () {
    it('can be used in a session file', async function () {
      const composer = await session('test-session', async ({ session }) => {
        session.import.instrument('electric-bass').from.library('core');
      });

      expect(composer.model.instruments.length).toEqual(1);
    });
  });

});