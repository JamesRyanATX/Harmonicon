function toneDocumentationUrl(toneObject) {
  return `https://tonejs.github.io/docs/14.7.7/${toneObject}`;
}

function isMimetypeSupported(mimetype) {
  const a = document.createElement('audio');

  return !!(a.canPlayType && a.canPlayType(mimetype).replace(/no/, ''));
}

export const demoHeader = `
/**
 *    __ _____   ___  __  _______  _  _______________  _  __
 *   / // / _ | / _  /  |/  / __  / |/ /  _/ ___/ __  / |/ /
 *  / _  / __ |/ , _/ /|_/ / /_/ /    // // /__/ /_/ /    / 
 * /_//_/_/ |_/_/|_/_/  /_/\\____/_/|_/___/\\___/\\____/_/|_/  
 *
 * ===========================================================
 * 
 * Harmonicon is an experimental music-as-code DAW for your 
 * browser.  It's like GarageBand, but for code!
 * 
 * Features:
 * 
 *  - A high-level composition language rooted in music theory
 *  - Baked in library of instruments and synthesizers
 *  - Multi-track sequencing
 *  - Effects, loops, sends, etc.
 *  - Powered by the Web Audio API, Tonejs, Tonaljs, Monaco,
 *    and a multitude of other things.
 * 
 * This project is experimental, so use at your own risk :-)
 * 
 * Click the [PLAY] button to hear what this file sounds like.
 * 
 */
`.trim();

export const toneSynthesizerInstrument = ({
  name = null,
  group = 'Synthesizers',
  toneInstrument = null,
  toneOptions = {},
  defaultOptions = {},
  suggestedOctave = 4,
}) => {
  return ({ library }) => {
    library.instrument(name, ({ instrument }) => {
      instrument.url('https://tonejs.github.io/');
      instrument.documentationUrl(toneDocumentationUrl(toneInstrument));
      instrument.author('Harmonicon');
      instrument.group(group);
      instrument.defaultOptions(defaultOptions);
      instrument.suggestedOctave(suggestedOctave);
      instrument.fn((options) => {
        return new Tone[toneInstrument](Object.assign({},
          toneOptions, defaultOptions, options));
      });
    });
  };
};

export const toneSamplerInstrument = ({
  name = null,
  group = 'Sampled',
  pitchAliases = {},
  urls = {},
  volume = 0,
  suggestedOctave = 4,
  oggFallback = 'wav'
}) => {

  return ({ library }) => {
    library.instrument(name, ({ instrument }) => {
      instrument.url('https://tonejs.github.io/');
      instrument.documentationUrl(toneDocumentationUrl('Sampler'));
      instrument.author('Harmonicon');
      instrument.group(group);
      instrument.pitchAliases(pitchAliases);
      instrument.defaultOptions({ volume });
      instrument.suggestedOctave(suggestedOctave);
      instrument.fn((options) => {

      if (oggFallback && !isMimetypeSupported('audio/ogg')) {
        Object.entries(urls).forEach(([ k, v ]) => {
          urls[k] = v.replace('.ogg', '.wav');
        });
      }
      
      return new Tone.Sampler(Object.assign({
          urls,
          volume,
          baseUrl: `/libraries/core/instruments/${name}/`,
        }, options || {}));
      });
    });
  };
};

export function toneEffect({
  name = null,
  group = 'Generic',
  toneEffect = null,
  toneOptions = { wet: 0.5 },
  defaultOptions = {},
}) {

  return ({ library }) => {
    return library.effect(name, ({ effect }) => {
      effect.url('https://tonejs.github.io/');
      effect.documentationUrl(toneDocumentationUrl(toneEffect));
      effect.author('Harmonicon');
      effect.group(group);
      effect.defaultOptions(defaultOptions);
      effect.fn((options) => {
        return new Tone[toneEffect](Object.assign({},
          toneOptions, defaultOptions, options));
      });
    });
  }

}
