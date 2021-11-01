# @composer/util

## Events

Useful snippets for console:

```
// Dump the number of listeners
function inspectEvents (obj) {
  Object.entries(obj.listeners)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .forEach(([ k, v ]) => { 
      if (v.length > 0) console.log(`${k}: ${v.length}`)
    });

  const total = Object.entries(obj.listeners)
    .reduce((total, [ k, v ]) => (total + v.length), 0);

  console.log(`=> ${total}`);
}
```