export function times(n, fn) {
  return Array.from(Array(n)).map((x, i) => {
    return fn(i)
  });
}