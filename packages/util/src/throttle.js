import { throttle, debounce } from 'throttle-debounce';
export { throttle, debounce };

/**
 * Like throttle and debounce, but with both leading and tailing calls.
 * 
 * @param {function} fn 
 * @param {object} options 
 * @param {number} options.interval - number of ms between calls
 */
export function meter(fn, {
  interval = 1000,
  name = 'my-meter',
  logger = console
}) {
  let queue = 0;
  let lastRun = 0;
  let timeout = null;

  function run() {

    // If queue is empty, kill the timeout and bail
    if (queue === 0) {
      return timeout = null;
    }

    logger.debug(`${name}: collapsed ${queue} requests`);
    fn.apply(this, arguments);
    
    // Clear queue but not timeout
    queue = 0;

    // Save the last run time
    lastRun = new Date();

    // Check for changes in [interval] ms
    timeout = setTimeout(run, interval);

  }

  return function () {

    // Increment request queue
    queue += 1;

    // If a run timeout is not already in progress, start one
    if (!timeout) {
      run.apply(this, arguments);
    }

  };
}