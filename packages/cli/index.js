import { run } from './src/run.js';

const options = {
  file: process.argv[2],
  wait: 1,
  timeout: 5,
  server: 'http://localhost:3000/',
  puppeteer: {
    headless: true,
    ignoreDefaultArgs: [
      "--mute-audio",
    ],
    args: [
      "--autoplay-policy=no-user-gesture-required",
    ],
  }
}

run(options);