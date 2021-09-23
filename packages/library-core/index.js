import { SessionComposer, library } from '@composer/compose';

import { amSynth } from './src/instruments/am-synth';
import { acousticGuitar } from './src/instruments/acoustic-guitar';
import { bassoon } from './src/instruments/bassoon';
import { cello } from './src/instruments/cello';
import { clarinet } from './src/instruments/clarinet';
import { contrabass } from './src/instruments/contrabass';
import { duoSynth } from './src/instruments/duo-synth';
import { drums } from './src/instruments/drums';
import { electricBass } from './src/instruments/electric-bass';
import { electricGuitar } from './src/instruments/electric-guitar';
import { flute } from './src/instruments/flute';
import { fmSynth } from './src/instruments/fm-synth';
import { frenchHorn } from './src/instruments/french-horn';
import { harmonium } from './src/instruments/harmonium';
import { harp } from './src/instruments/harp';
import { membraneSynth } from './src/instruments/membrane-synth';
import { metalSynth } from './src/instruments/metal-synth';
import { monoSynth } from './src/instruments/mono-synth';
import { noiseSynth } from './src/instruments/noise-synth';
import { nylonGuitar } from './src/instruments/nylon-guitar';
import { organ } from './src/instruments/organ';
import { piano } from './src/instruments/piano';
import { pluckSynth } from './src/instruments/pluck-synth';
import { polySynth } from './src/instruments/poly-synth';
import { saxophone } from './src/instruments/saxophone';
import { synth } from './src/instruments/synth';
import { trombone } from './src/instruments/trombone';
import { trumpet } from './src/instruments/trumpet';
import { tuba } from './src/instruments/tuba';
import { violin } from './src/instruments/violin';
import { xylophone } from './src/instruments/xylophone';

import { chorusEffect } from './src/effects/chorus';
import { delayEffect } from './src/effects/delay';
import { distortionEffect } from './src/effects/distortion';
import { phaserEffect } from './src/effects/phaser';
import { pitchShiftEffect } from './src/effects/pitch-shift';
import { reverbEffect } from './src/effects/reverb';
import { tremoloEffect } from './src/effects/tremolo';
import { vibratoEffect } from './src/effects/vibrato';

import { kitchenSyncDemo } from './src/demos/kitchen-sync';

import { effectChainSnippet } from './src/snippets/effect-chain';

import { blankTemplate } from './src/templates/blank';
import { pianoTemplate } from './src/templates/piano';

// Library name
export const name = 'core';

// Build library
export const build = async () => {
  return library('core', function ({ library }) {
    [

      // Instruments
      acousticGuitar,
      amSynth,
      bassoon,
      cello,
      clarinet,
      contrabass,
      drums,
      duoSynth,
      electricBass,
      electricGuitar,
      flute,
      fmSynth,
      frenchHorn,
      harmonium,
      harp,
      membraneSynth,
      metalSynth,
      monoSynth,
      noiseSynth,
      nylonGuitar,
      organ,
      piano,
      pluckSynth,
      polySynth,
      saxophone,
      synth,
      trombone,
      trumpet,
      tuba,
      violin,
      xylophone,

      // Effects
      chorusEffect,
      delayEffect,
      distortionEffect,
      phaserEffect,
      pitchShiftEffect,
      reverbEffect,
      tremoloEffect,
      vibratoEffect,

      // Snippets
      effectChainSnippet,

      // Templates
      blankTemplate,
      pianoTemplate,

      // Demos
      kitchenSyncDemo,

    ].forEach((c) => (c({ library })));
  });
};