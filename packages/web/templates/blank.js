export const source = `

session('new session', async ({ session }) => {
  session.at(0, 0, 0)
    .meter([ 4, 4 ])
    .tempo(120)
    .swing(0)
    .key('c')
    .scale('major');

});

`.trim();