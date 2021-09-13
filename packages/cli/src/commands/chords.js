import { ChordModel } from '@composer/core';
import Table from 'cli-table2';
import chalk from 'chalk';

export const description = 'List supported chords and types';

export const examples = [
  {
    name: 'Generate shell script:',
    code: [ 'composer chords' ]
  },
];

export const options = [
  { 
    name: 'root',
    alias: 'r',
    type: String,
    defaultValue: 'c4',
    description: 'Root note'
  },
  { 
    name: 'tonic',
    alias: 't',
    type: String,
    description: 'Tonic note (optional)'
  },
];

export const run = async ({ root, tonic, octave }, context) => {

  function printChordTypes({
    chordTypes = [],
  }) {
    const table = new Table({
      head: [
        chalk.yellow('Symbol'),
        chalk.yellow('Name'),
        chalk.yellow('Quality'),
        chalk.yellow('Root'),
        chalk.yellow('Tonic'),
        chalk.yellow('Notes')
      ],
      style: {
        compact: true,
      }
    });

    chordTypes
      .sort((a, b) => {
        return a.symbol < b.symbol ? -1 : 1;
      })
      .forEach((chord) => {
        table.push([
          chalk.bold.white(chord.symbol),
          chord.name,
          chord.quality,
          chord.root,
          chord.tonic,
          chord.notes.join(' ')
        ]);  
      });

    console.log(`${table.toString()}\n\n${chordTypes.length} matching chord(s).\n`);
  }

  printChordTypes({
    chordTypes: ChordModel.chordsFor({ root, tonic })
      .sort((a, b) => {
        return a.quality < b.quality ? -1 : 1;
      }),
  })
}