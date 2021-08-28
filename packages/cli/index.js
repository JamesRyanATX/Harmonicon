import { run } from './src/commands/run.js';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

const optionDefinitions = [
  { 
    name: 'file',
    type: String, 
    multiple: false, 
    defaultOption: true,
    description: 'Composer file to read'
  },
  { 
    name: 'timeout', 
    alias: 't', 
    type: Number, 
    defaultValue: 5,
    description: 'Max allowed run time, in seconds'
  },
  { 
    name: 'wait', 
    alias: 'w', 
    type: Number, 
    defaultValue: 1,
    description: 'Wait time between parsing and rendering',
  },
  { 
    name: 'server', 
    alias: 's', 
    type: Number, 
    defaultValue: 'http://localhost:3000/remote',
    description: 'Composer server to use for rendering',
  },
  {
    name: 'headless', 
    type: Boolean, 
    defaultValue: true,
    description: 'Run browser in headless mode'
  },
  {
    name: 'help', 
    alias: 'h',
    type: Boolean, 
    defaultValue: false,
    description: 'Display usage information'
  },
];

const usage = [
  {
    header: 'Composer',
    content: 'Parsing and rendering composer files.'
  },
  {
    header: 'Usage',
    content: 'composer [file] [...options]'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
];

(async () => {
  const options = commandLineArgs(optionDefinitions);

  if (options.help) {
    console.log(commandLineUsage(usage));
  }
  else {
    options.puppeteer = {
      headless: true,
      devtools: false,
      ignoreDefaultArgs: [
        "--mute-audio",
      ],
      args: [
        "--autoplay-policy=no-user-gesture-required",
      ],
    }

    await run(options);
  }
})();