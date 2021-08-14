import puppeteer from 'puppeteer';
import fs from 'fs';
import { Logger } from '@composer/util';

const logger = {
  cli: new Logger('Client'),
  browser: new Logger(),
};

async function start(options) {
  const browser = await puppeteer.launch(options.puppeteer);
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

export async function run(options) {
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

  await group('2. Parsing Session', `
    (async () => {
      return window.SessionComposer.parse({
        code: ${JSON.stringify(source)}
      });
    })()
  `);  

  await new Promise((proceed) => {
    logger.cli.debug(`Pausing for ${options.wait}s for dangling asyncs`)
    setTimeout(proceed, options.wait * 1000);
  });

  await group('3. Rendering Session', async () => {
    return SessionComposer.current.render(ToneDriver);
  });

  await group('4. Playing Session', async () => {
    return SessionComposer.current.renderer.play({
      markTime: true,
    });
  });
}
