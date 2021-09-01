import { session, SessionComposer } from './src/session';
import { library, LibraryComposer } from './src/library';
import { instrument, InstrumentComposer } from './src/instrument';
import { track, TrackComposer } from './src/track';
import { ComposerError } from './src/errors';
import { Harmonicon } from '@composer/core';

import {
  doubleDottedLarge,
  dottedLarge,
  large,
  doubleDottedLong,
  dottedLong,
  long,
  doubleDottedDoubleWhole,
  dottedDoubleWhole,
  doubleWhole,
  doubleDottedWhole,
  dottedWhole,
  whole,
  doubleDottedHalf,
  dottedHalf,
  half,
  doubleDottedQuarter,
  dottedQuarter,
  quarter,
  doubleDottedEighth,
  dottedEighth,
  eighth,
  doubleDottedSixteenth,
  dottedSixteenth,
  sixteenth,
  doubleDottedThirtySecond,
  dottedThirtySecond,
  thirtySecond,
  doubleDottedSixtyFourth,
  dottedSixtyFourth,
  sixtyFourth
} from './src/util/note.js';

export {
  ComposerError,
  InstrumentComposer,
  LibraryComposer,
  SessionComposer,
  TrackComposer,

  doubleDottedLarge,
  instrument,
  library,
  session,
  track,

  dottedLarge,
  large,
  doubleDottedLong,
  dottedLong,
  long,
  doubleDottedDoubleWhole,
  dottedDoubleWhole,
  doubleWhole,
  doubleDottedWhole,
  dottedWhole,
  whole,
  doubleDottedHalf,
  dottedHalf,
  half,
  doubleDottedQuarter,
  dottedQuarter,
  quarter,
  doubleDottedEighth,
  dottedEighth,
  eighth,
  doubleDottedSixteenth,
  dottedSixteenth,
  sixteenth,
  doubleDottedThirtySecond,
  dottedThirtySecond,
  thirtySecond,
  doubleDottedSixtyFourth,
  dottedSixtyFourth,
  sixtyFourth
}

export const parseCode = async (code) => {
  const ns = {
    SessionComposer,
    session,
    instrument,
    track,
    doubleDottedLarge,
    dottedLarge,
    large,
    doubleDottedLong,
    dottedLong,
    long,
    doubleDottedDoubleWhole,
    dottedDoubleWhole,
    doubleWhole,
    doubleDottedWhole,
    dottedWhole,
    whole,
    doubleDottedHalf,
    dottedHalf,
    half,
    doubleDottedQuarter,
    dottedQuarter,
    quarter,
    doubleDottedEighth,
    dottedEighth,
    eighth,
    doubleDottedSixteenth,
    dottedSixteenth,
    sixteenth,
    doubleDottedThirtySecond,
    dottedThirtySecond,
    thirtySecond,
    doubleDottedSixtyFourth,
    dottedSixtyFourth,
    sixtyFourth
  };

  const source = `
    "use strict";

    ${Object.keys(ns).map((name) => {
      return `const ${name} = ns.${name};\n`;
    }).join('')}

    return (async () => { ${code} })();
  `;

  return Function('ns', source)(ns);
}

export const parse = async (options = {}) => {
  options = Object.assign({
    code: null,
    file: null,
    url: null,
    timeout: 2,
    poll: 0.5,
    silent: false,
  }, options);

  return new Promise(async (accept) => {
    try {
      Harmonicon.once('composer:parsed', accept);

      if (options.code) {
        await parseCode(options.code, options);
      }
      else if (options.url) {
        await parseUrl(options.url, options);
      }
      else if (options.file) {
        await parseFile(options.file, options);
      }
      else {
        throw new TypeError("no session source provided (expected code, url or file)");
      }
    }
    catch (e) {
      if (options.silent) {
        console.warning('unable to parse session')
        console.warning(e);
      }
      else {
        throw (e);
      }
    }
  });
}

export const render = async (options = {}, driver) => {
  const composer = await parse(options);
  const renderer = await composer.render(driver);

  return { composer, renderer };
}