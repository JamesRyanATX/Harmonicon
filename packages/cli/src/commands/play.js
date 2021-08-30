import puppeteer from 'puppeteer';
import fs from 'fs';
import { Logger } from '@composer/util';

export const description = 'Render and play a session file';

export const examples = [
  {
    name: 'Play a session file',
    code: [ 'composer play --file=/path/to/session.js' ]
  },
  {
    name: 'Play a session file with a longer timeout',
    code: [ 'composer play --file=/path/to/session.js --timeout=60' ]
  },
]

export const options = [
  { 
    name: 'file',
    alias: 'f',
    type: String, 
    description: 'File to play'
  },
  { 
    name: 'timeout', 
    alias: 't', 
    type: Number, 
    defaultValue: 30,
    description: 'Max allowed run time, in seconds'
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
];


const logger = {
  cli: new Logger('Client'),
  browser: new Logger(),
};

async function start(options) {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
    ignoreDefaultArgs: [
      "--mute-audio",
    ],
    args: [
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const page = await browser.newPage();

  await page.goto(options.server);

  page.on('console', (msg) => {
    logger.browser[msg.type()](msg.text());
  });

  setTimeout(async () => {
    await browser.close();
    logger.cli.error(`${options.timeout}s timeout reached; exiting now.`);
    process.exit(1);
  }, options.timeout * 1000);

  return { execute: page.evaluate.bind(page) };
}


export const run = async (options, context) => {
  const server = await start(options);
  const source = fs.readFileSync(options.file, 'utf8');

  async function group(name, toExec) {
    logger.cli.header(name);
    return server.execute(toExec);
  }

  await group('1. Connecting to Server', `
    (async () => {
      console.debug('Hello from the browser!')
      return Tone.start();
    })();
  `);

  // await group('2. Parsing Session', `
  //   (async () => {
  //     return window.SessionComposer.parse({
  //       code: ${JSON.stringify(source)}
  //     });
  //   })()
  // `);  

  // await new Promise((proceed) => {
  //   logger.cli.debug(`Pausing for ${options.wait}s for dangling asyncs`)
  //   setTimeout(proceed, options.wait * 1000);
  // });

  await group('3. Rendering Session', `
    (async () => {
      return SessionComposer.render({ code: ${JSON.stringify(source)} }, new ToneAudioDriver);
    })();
  `);

  await group('4. Playing Session', async () => {
    return SessionComposer.current.renderer.play({
      markTime: true,
    });
  });
}
