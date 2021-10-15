export function measure(obj, fn, label = 'measure: ') {
  const orig = obj[fn];

  obj[fn] = async function () {
    this.logger.info(`${label} started`);

    const startAt = (new Date()).getTime();
    const results = await orig.apply(this, arguments);
    const stopAt = (new Date()).getTime();
    const elapsed = Math.round((stopAt - startAt) * 100) / 100000;

    this.logger.info(`${label} completed in ${elapsed}s`);

    return results;
  }
}