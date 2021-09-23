function toneDocumentationUrl(toneObject) {
  return `https://tonejs.github.io/docs/14.7.7/${toneObject}`;
}

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
