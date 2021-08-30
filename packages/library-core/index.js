import { SessionComposer, library } from '@composer/compose';

import { acousticGuitar } from './src/instruments/acoustic-guitar';
import { bassoon } from './src/instruments/bassoon';
import { cello } from './src/instruments/cello';
import { clarinet } from './src/instruments/clarinet';
import { contrabass } from './src/instruments/contrabass';
import { drums } from './src/instruments/drums';
import { electricBass } from './src/instruments/electric-bass';
import { electricGuitar } from './src/instruments/electric-guitar';
import { flute } from './src/instruments/flute';
import { frenchHorn } from './src/instruments/french-horn';
import { harmonium } from './src/instruments/harmonium';
import { harp } from './src/instruments/harp';
import { monoSynth } from './src/instruments/mono-synth';
import { nylonGuitar } from './src/instruments/nylon-guitar';
import { organ } from './src/instruments/organ';
import { piano } from './src/instruments/piano';
import { saxophone } from './src/instruments/saxophone';
import { trombone } from './src/instruments/trombone';
import { trumpet } from './src/instruments/trumpet';
import { tuba } from './src/instruments/tuba';
import { violin } from './src/instruments/violin';
import { xylophone } from './src/instruments/xylophone';

// Library name
export const name = 'core';

// Build library
export const build = async () => {
  return library('core', function ({ library }) {
    acousticGuitar({ library });
    bassoon({ library });
    cello({ library });
    clarinet({ library });
    contrabass({ library });
    drums({ library });
    electricBass({ library });
    electricGuitar({ library });
    flute({ library });
    frenchHorn({ library });
    harmonium({ library });
    harp({ library });
    monoSynth({ library });
    nylonGuitar({ library });
    organ({ library });
    piano({ library });
    saxophone({ library });
    trombone({ library });
    trumpet({ library });
    tuba({ library });
    violin({ library });
    xylophone({ library });
  });
};