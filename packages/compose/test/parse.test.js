import { parse, SessionComposer } from '../';

describe('parse', function () {
  it('parses code', async function () {
    const result = await parse({
      code: `
        session('my-song', ({ session }) => {
          session.at(0, 0, 0).meter([ 4, 4 ]);
          session.at(0, 0, 0).tempo(100);
          session.at(0, 0, 0).swing(0.4);
          session.at(0, 0, 0).key('c');
          session.at(0, 0, 0).scale('major');
        });
      `
    });

    expect(result).toBeInstanceOf(SessionComposer);
  });

  it.skip('parses a url', async function () {
    const result = await parse({
      url: 'http://google.com'
    });

    expect(result).toBeInstanceOf(SessionComposer);
  });

  it.skip('parses a file', async function () {
    const result = await parse({
      file: '/tmp/foo.js'
    });

    expect(result).toBeInstanceOf(SessionComposer);
  });

});