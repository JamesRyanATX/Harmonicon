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

  logger.cli.header('Starting server');

  // Ensure audio driver is ready
  await server.execute(async () => {
    return Tone.start();
  });


  logger.cli.header('Parsing session file');

  // Parse composition
  await server.execute(source);

  // Render and play audio
  setTimeout(async () => {
    logger.cli.header('Rendering session');

    await server.execute(async () => {
      if (SessionComposer.current) {
        const renderer = await SessionComposer.current.render(ToneDriver);
        const driver = renderer.driver;

        driver.setTransportPosition('0:0:0');
        driver.markTime();
        driver.play();
      }
      else {
        console.debug('no session detected; skipping render');
      }
    });
  }, options.wait * 1000);

}
