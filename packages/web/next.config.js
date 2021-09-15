const path = require('path');

module.exports = {

  webpack(config, options) {

    // Avoid the unbelievably obtuse "Hooks can only be called inside of the
    // body of a function component" error.
    //
    // https://reactjs.org/warnings/invalid-hook-call-warning.html
    // https://github.com/facebook/react/issues/15315
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.react = path.resolve('./node_modules/react')

    return config;
  },

  //cssLoaderOptions: { url: false }

};