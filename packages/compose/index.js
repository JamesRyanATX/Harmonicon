import { session, SessionComposer } from './src/session';
import { instrument, InstrumentComposer } from './src/instrument';
import { track, TrackComposer } from './src/track';

import {
  whole,
  half,
  quarter,
  eighth,
  sixteenth,
  thirtysecond,
  sixtyfourth
} from './src/util/note.js';

export {
  SessionComposer,
  InstrumentComposer,
  TrackComposer,
  session,
  instrument,
  track,
  whole,
  half,
  quarter,
  eighth,
  sixteenth,
  thirtysecond,
  sixtyfourth
}

export const parseCode = async (code) => {
  const ns = {
    SessionComposer,
    session,
    instrument,
    track,
    whole,
    half,
    quarter,
    eighth,
    sixteenth,
    thirtysecond,
    sixtyfourth
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

  try {
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

  return new Promise((accept, reject) => {
    const startedAt = new Date().getTime();
    
    (function pollForSession () {
      const now = new Date().getTime();
      const duration = (now - startedAt) / 1000;

      if (SessionComposer.current) {
        accept(SessionComposer.current);
      }
      else if (duration >= options.timeout) {
        reject(`timeout reached (${options.timeout}s)`);
      }
      else {
        setTimeout(pollForSession, options.poll * 1000);
      }
    })();
  });
}
