import commandLineUsage from 'command-line-usage';
import chalk from 'chalk';
import { globalOptions } from '../cli.js';

const sections = {
  title: (definition) => {
    return [
      {
        header: ['Harmonicon'].concat(definition.path).join(' > '),
        content: definition.description,
      },
    ];
  },

  usage: (definition) => {
    const hasSubcommands = Object.keys(definition.commands).length > 0;

    return [
      {
        header: 'Usage',
        content:
          definition.usage ||
          `harmonicon ${definition.path.join(' ')}${
            hasSubcommands ? ` <${Object.keys(definition.commands).sort().join('|')}>` : ''
          } [...options]`,
      },
    ];
  },

  examples: (definition) => {
    if (!definition.examples) {
      return [];
    }

    return [
      {
        header: 'Examples:',
        content: definition.examples
          .map((example, i) => {
            return `${i + 1}. ${example.name}\n${chalk.yellow(example.code.join('\n'))}`;
          })
          .join('\n\n'),
      },
    ];
  },

  commands: (definition) => {
    if (Object.keys(definition.commands).length === 0) {
      return [];
    }

    return [
      {
        header: 'Commands:',
        content: Object.keys(definition.commands).map(command => ({
          name: command,
          summary: definition.commands[command].description,
        })),
      },
    ];
  },

  options: (definition) => {
    if (definition.options.length === 0) {
      return [];
    }

    return [
      {
        header: 'Options:',
        optionList: definition.options,
      },
    ];
  },

  globalOptions: () => {
    return [
      {
        header: 'Global Options:',
        optionList: globalOptions,
      },
    ];
  },
};

/**
 * Generate usage text based on command definition object.
 *
 * @param {object} definition
 */
export const usage = (definition) => {
  const preparedSections = [
    'title',
    'usage',
    'examples',
    'commands',
    'options',
    'globalOptions',
  ].reduce((preparedSections, section) => {
    return preparedSections.concat(sections[section](definition));
  }, []);

  console.log(commandLineUsage(preparedSections));
};