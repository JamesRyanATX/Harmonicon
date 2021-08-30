import commandLineArgs from 'command-line-args';

import { globalOptions } from './options.js';
import { usage } from './usage.js';


/**
 * Create a context object used to pass data in command sequences
 * 
 * @param  {object} options
 * @return {object}
 */
async function createContext(options = {}) {
  return {};
}

async function runWithContext(definition, options) {
  const context = await createContext(definition, options);

  // Run command option before functions
  for (let i = 0; i < definition.options.length; i += 1) {
    if (definition.options[i].before) {
      await definition.options[i].before(options, context);
    }
  }

  // Run command's before() function
  if (definition.before) {
    await definition.before(options, context);
  }

  return definition.run(options, context);
}

/**
 * Recursively parse argv against a command definition.
 * 
 * @param {object} definition={}
 * @param {string} args=undefined
 */
export const run = async (definition = {}, args = undefined) => {
  definition = Object.assign({
    path: [],
    commands: {},
    options: [],
  }, definition);

  const argv = (typeof args === 'undefined') ? process.argv.slice(2) : args;
  const hasSubcommands = Object.keys(definition.commands).length > 0;
  const hasRun = !!definition.run;

  // If definition has subcommands, parse it out and run the subcommand definition
  if (hasSubcommands) {
    const hasArgvSubcommand = typeof definition.commands[argv[0]] !== 'undefined';
    const argvSubcommand = hasArgvSubcommand ? argv[0] : null;
    const argvRemainder = hasArgvSubcommand ? argv.slice(1) : null;
    const argvPath = [].concat(definition.path).concat([ argvSubcommand ]);

    if (hasArgvSubcommand) {
      return run(Object.assign({
        path: argvPath,
      }, definition.commands[argvSubcommand]), argvRemainder);
    }
  }

  // Parse options with special ones merged in
  const parsedOptions = commandLineArgs([]
    .concat(globalOptions)
    .concat(definition.options), { argv });


  // Responder function
  const respond = (overrides) => {
    return Object.assign({
      definition,
      path: definition.path,
      mode: 'execute', // execute|usage|error
      error: null,
      result: null,
    }, overrides);
  }

  // Parse and merge command options
  if (parsedOptions.help || !hasRun) {
    return respond({
      mode: 'usage',
      result: usage(definition)
    });
  }

  return respond({
    result: await runWithContext(definition, parsedOptions)
  });
}
