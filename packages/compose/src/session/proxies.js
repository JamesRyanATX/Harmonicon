export const SessionComposerProxies = {

  send: {

    effect: function (input) {
      return {
        to: {
          main: function () {
            return this.send.effect(input).to.track('main');
          }.bind(this),

          track: function (output) {
            this.send({
              inputType: 'effect',
              input: input,
              outputType: 'track',
              output: output
            });
          }.bind(this)
        }
      };
    },

    track: function (input) {
      return {
        to: {
          main: function () {
            return this.send.track(input).to.track('main');
          }.bind(this),

          track: function (output) {
            this.send({
              inputType: 'track',
              input: input,
              outputType: 'track',
              output: output
            });
          }.bind(this),

          effect: function (output) {
            this.send({
              inputType: 'track',
              input: input,
              outputType: 'effect',
              output: output
            });
          }.bind(this)
        }
      };
    },

    instrument: function (input) {
      return {
        to: {

          effect: function (output) {
            this.send({
              inputType: 'instrument',
              input: input,
              outputType: 'effect',
              output: output
            });
          }.bind(this),

          track: function (output) {
            this.send({
              inputType: 'instrument',
              input: input,
              outputType: 'track',
              output: output
            });
          }.bind(this)
        }
      };
    }
  }

};