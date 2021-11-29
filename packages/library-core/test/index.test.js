import { build } from "../";
import { SessionComposer, session, render } from "@composer/compose";
import {
  Harmonicon,
  InteractiveRendererModel,
  MockAudioDriver,
  MockMidiDriver,
  MockStorageDriver,
} from "@composer/core";

describe('@composer/library-core', function () {
  let library;

  beforeEach(async () => {
    await Harmonicon.initialize({
      drivers: {
        audio: new MockAudioDriver.Driver(),
        midi: new MockMidiDriver.Driver(),
        storage: new MockStorageDriver.Driver(),
      },
      libraries: [ library = await build() ],
    });
  });

  afterEach(() => {
    Harmonicon.uninstall('core');
  })

  function getEffect(name) {
    return library.model.effects.filterByProperty('name', name)[0];
  }

  function getInstrument(name) {
    return library.model.instruments.filterByProperty('name', name)[0];
  }

  describe('build', function () {
    it('contains all instruments', async function () {
      const library = await build();

      expect(library.model.instruments.length).toEqual(32);
      expect(library.model.effects.length).toEqual(8);
      expect(library.model.templates.length).toEqual(2);
      expect(library.model.snippets.length).toEqual(1);
      expect(library.model.demos.length).toEqual(3);
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
  });

  describe('demos', function () {

    beforeEach(() => {
      library.model.instruments.forEach((instrument) => {
        instrument.fn = () => {
          return { loaded: true };
        }
      });

      library.model.effects.forEach((effect) => {
        effect.fn = () => {
          return { loaded: true };
        }
      });
    });

    [
      'Expressions',
    ].forEach((name) => {
      describe(name, function () {
        it('renders', async () => {
          const demo = library.model.demos.getByName(name);
          const code = demo.source;
          const result = await render({ code });

          expect(result.composer).toBeInstanceOf(SessionComposer);
          expect(result.renderer).toBeInstanceOf(InteractiveRendererModel);
        });
      });
    });
  });

  describe('instruments', function () {
    describe('drums', function () {
      it('is defined', function () {
        const name = 'drums';
        const instrument = getInstrument(name);

        expect(instrument.url).toEqual('https://tonejs.github.io/');
        expect(instrument.documentationUrl).toEqual(expect.any(String));
        expect(instrument.author).toEqual('Harmonicon');
        expect(instrument.group).toEqual('Drums');
        expect(instrument.defaultOptions).toEqual({
          volume: 0,
        });
        expect(instrument.pitchAliases).toEqual({
          hihat: "c5",
          hihat2: "c#5",
          hihat3: "d5",
          hihatopen: "d#5",
          hihatopen2: "e5",
          hihatopen3: "f5",
          kick: "c2",
          kicklight: "g2",
          perc1: "c6",
          perc3: "d6",
          perc4: "d#6",
          perc5: "e6",
          ride: "f#5",
          ridebell: "g5",
          ridebellloud: "g#5",
          sidestick: "a4",
          sidestick2: "a#4",
          snare: "c4",
          snare2: "c#4",
          snareoff: "d4",
          snarerim: "d#4",
          snarerimshot: "e4",
          snarerimshot2: "f4",
          snareroll: "f#4",
          snarerollshort: "g4",
          snarerollshort2: "g#4",
          tom: "c3",
          tomlight: "g3",
        });
      });
    });
  });
});