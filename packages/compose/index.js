import { session, SessionComposer } from './src/session';
import { library, LibraryComposer } from './src/library';
import { instrument, InstrumentComposer } from './src/instrument';
import { track, TrackComposer } from './src/track';

import { ComposerError } from './src/errors';
import { Harmonicon } from '@composer/core';

import { large } from './src/note/large';
import { long } from './src/note/long';
import { doubleWhole } from './src/note/double-whole';
import { whole } from './src/note/whole';
import { half } from './src/note/half';
import { quarter } from './src/note/quarter';
import { eighth } from './src/note/eighth';
import { sixteenth } from './src/note/sixteenth';
import { thirtySecond } from './src/note/thirty-second';
import { sixtyFourth } from './src/note/sixty-fourth';

import { dotted } from './src/note/dotted';
import { doubleDotted } from './src/note/double-dotted';
import { triplet } from './src/note/triplet';
import { quintuplet } from './src/note/quintuplet';
import { septuplet } from './src/note/septuplet';

export {
  ComposerError,
  InstrumentComposer,
  LibraryComposer,
  SessionComposer,
  TrackComposer,

  instrument,
  library,
  session,
  track,

  dotted,
  doubleDotted,
  triplet,
  quintuplet,
  septuplet,

  large,
  long,
  doubleWhole,
  whole,
  half,
  quarter,
  eighth,
  sixteenth,
  thirtySecond,
  sixtyFourth
}

export const parseCode = async (code) => {
  const ns = {
    SessionComposer,
    session,
    instrument,
    track,

    dotted,
    doubleDotted,
    triplet,
    quintuplet,
    septuplet,

    large,
    long,
    doubleWhole,
    whole,
    half,
    quarter,
    eighth,
    sixteenth,
    thirtySecond,
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