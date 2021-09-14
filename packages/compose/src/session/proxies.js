function createSendFunction(input, inputType, outputType) {
  return function (output) {
    this.send({
      inputType: inputType,
      input: input,
      outputType: outputType,
      output: output
    });
  };
}

function createImportProxy({ collection, composer }) {
  return function (name) {
    return {
      from: {
        library: function (libraryName) {
          return this.use({ source: 'library', libraryName, name, collection, composer });
        }.bind(this)
      }
    }
  }
}

function createSendProxy({ inputType }) {
  return function (input) {
    return {
      to: {
        main: function () {
          return this.send[inputType](input).to.track('main');
        }.bind(this),

        effect: createSendFunction(input, inputType, 'effect').bind(this),
        instrument: createSendFunction(input, inputType, 'instrument').bind(this),
        track: createSendFunction(input, inputType, 'track').bind(this),
      }
    };
  }
}

/**
 * @ignore
 */
export const SessionComposerProxies = {

  use: {

    effect: createImportProxy({
      collection: 'effects',
      composer: 'effect'
    }),

    instrument: createImportProxy({
      collection: 'instruments',
      composer: 'instrument'
    })

  },

  send: {

    effect: createSendProxy({
      inputType: 'effect'
    }),

    instrument: createSendProxy({
      inputType: 'instrument'
    }),

    track: createSendProxy({
      inputType: 'track'
    }),

  }

};