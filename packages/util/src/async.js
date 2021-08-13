export async function mapParallel(items, fn) {
  return Promise.all(items.map((item, i) => {
    return fn(item, i);
  }));
}

export async function mapSeries(items, fn) {
  const results = [];

  for (let i = 0; i < items.length; i += 1) {
    results.push(await fn(items[i], i));
  }

  return results;
}
