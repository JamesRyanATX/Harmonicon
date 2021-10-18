export function measure(obj, fn, {
  label = null,
  logStart = false,
  logComplete = true,
}) {

  const orig = obj[fn];

  obj[fn] = async function () {

    if (logStart) {
      this.logger.info(`${label} started`);
    }

    const startAt = (new Date()).getTime();
    const results = await orig.apply(this, arguments);
    const stopAt = (new Date()).getTime();
    const elapsed = Math.round((stopAt - startAt) * 100) / 100000;

    if (logComplete) {
      this.logger.info(`${label} completed in ${elapsed}s`);
    }

    return results;
  }
}

export function measureSync(obj, fn, {
  label = null,
  logStart = false,
  logComplete = true,
}) {

  const orig = obj[fn];

  obj[fn] = function () {

    if (logStart) {
      this.logger.info(`${label} started`);
    }

    const startAt = (new Date()).getTime();
    const results = orig.apply(this, arguments);
    const stopAt = (new Date()).getTime();
    const elapsed = Math.round((stopAt - startAt) * 100) / 100000;

    if (logComplete) {
      this.logger.info(`${label} completed in ${elapsed}s`);
    }

    return results;
  }
}

export function measureAsync(obj, fn, options = {}) {
  return measure(obj, fn, options);
}