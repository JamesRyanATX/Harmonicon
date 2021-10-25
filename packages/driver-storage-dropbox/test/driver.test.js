import { Driver } from "../src/driver";

describe('Driver', function () {
  
  async function sleep(t = 1) {
    return new Promise((accept) => {
      setTimeout(accept, t * 1000);
    })
  }

  function createDriver(options = {}) {
    return new Driver({
      prefix: 'composer-test',
      clientId: 'n0a2ta8zr4xccgw',
      applicationUrl: 'http://localhost:7000',
      accessToken: process.env.DROPBOX_TEST_TOKEN,
      ...options
    });
  };

  beforeEach(async () => {
    return createDriver().flush();
  })

  describe('#idToKey()', function () {
    it('converts an id to a storage key', function () {
      const driver = createDriver();

      expect(driver.idToKey('a')).toEqual('/composer-test/a.json');
      expect(driver.idToKey('a:b:c')).toEqual('/composer-test/a/b/c.json');
      expect(driver.idToKey(['a', 'b', 'c'])).toEqual('/composer-test/a/b/c.json');
    });
  });

  describe('#keyToId()', function () {
    it('converts a storage key to an id', function () {
      const driver = createDriver();

      expect(driver.keyToId('/composer-test/a.json')).toEqual('a');
      expect(driver.keyToId('/composer-test/a/b/c.json')).toEqual('a:b:c');
      
      expect(() => (driver.keyToId('c.json')))
        .toThrow('Storage key "c.json" appears to not have the correct prefix.');
    });
  });

  describe('#getAuthenticationUrl()', function () {
    it('returns a dropbox url', async function () {
      expect(await createDriver().getAuthenticationUrl({ returnPath: '/foo' }))
        .toEqual('https://dropbox.com/oauth2/authorize?response_type=token&client_id=n0a2ta8zr4xccgw&redirect_uri=http://localhost:7000/foo');
    });
  });

  describe('#get()', function () {
    it('returns data from dropbox', async function () {
      const driver = createDriver();
      await driver.set('foo', { foo: 'bar' })

      expect(await driver.get('foo')).toEqual({ foo: 'bar' });
    });

    it('returns undefined if key does not exist', async function () {
      const driver = createDriver();

      expect(await driver.get('foo-missing')).toEqual(undefined);
    });
  });

  describe('#set()', function () {
    it('saves data in dropbox', async function () {
      const driver = createDriver();

      expect(await driver.set('foo', { foo: 'bar' })).toEqual(true);
    });

    it('is idempotent', async function () {
      const driver = createDriver();

      expect(await driver.set('foo', { foo: 'bar' })).toEqual(true);
      await sleep(1)
      expect(await driver.set([ 'foo' ], { foo: 'bar' })).toEqual(true);
      expect(await driver.get([ 'foo' ])).toEqual({ foo: 'bar' });
    });
  });

  describe('#unset()', function () {
    it('deletes a file', async function () {
      const driver = createDriver();
      await driver.set('foo', { foo: 'bar' })

      expect(await driver.unset('foo')).toEqual(true);
      expect(await driver.get('foo')).toEqual(undefined);
    });

    it('does nothing if file does not exist', async function () {
      const driver = createDriver();

      expect(await driver.unset('foo-missing')).toEqual(true);
    });
  });

  describe('#exists()', function () {
    it('returns true if a key exists', async function () {
      const driver = createDriver();
      await driver.set('foo', { foo: 'bar' })

      expect(await driver.exists('foo')).toEqual(true);
    });

    it('returns false if a key does not exist', async function () {
      const driver = createDriver();

      expect(await driver.exists('foo-missing')).toEqual(false);
    });
  });

  describe('#list()', function () {
    it('returns a list of all objects', async function () {
      const driver = createDriver();
      
      await driver.set('foo', { foo: 'bar' });
      await sleep(3);

      expect(await driver.list()).toEqual([ 'foo' ]);
    });

    it('can return additional metadata', async function () {
      const driver = createDriver();

      await driver.set('foo', { foo: 'bar' })
      await sleep(3);

      expect(await driver.list({ includeMetadata: true }))
        .toEqual([ {
          id: 'foo',
          size: 13,
          updatedAt: expect.any(Date)
        } ]);
    });
  });

  describe('#flush()', function () {
    it('empties contents of storage', async function () {
      const driver = createDriver();
      await driver.set('foo', { foo: 'bar' })

      expect(await driver.flush()).toEqual(true);
      expect(await driver.list()).toEqual([]);
    });    
  });

});