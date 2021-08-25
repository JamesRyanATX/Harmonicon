import { session } from '../';

function createInstrumentFunction() {
  return async () => {
    return 'ok'; // audio context
  }
}

function withSession(fn) {
  return session('test session', async ({ session }) => {

    session.instrument('bass-instrument', createInstrumentFunction());
    session.instrument('drums-instrument', createInstrumentFunction());
    session.instrument('guitar-instrument', createInstrumentFunction());

    session.effect('reverb-effect', async () => {});

    session.track('bass-track', async () => {});
    session.track('drums-track', async () => {});
    session.track('guitar-track', async () => {});

    fn({ session });
  });
}

describe('#send()', function () {
  it('creates a patch', async function () {
    const result = await withSession(({ session }) => {
      session.send({
        inputType: 'instrument',
        input: 'bass-instrument',
        outputType: 'track',
        output: 'bass-track'
      });
    });

    const session = result.model;
    const patch = session.patches.first();

    expect(session.patches.length).toEqual(1);
    expect(patch.inputType).toEqual('instrument');
    expect(patch.input).toEqual('bass-instrument');
    expect(patch.outputType).toEqual('track');
    expect(patch.output).toEqual('bass-track');
  });
});

describe('#send.instrument().to.track()', function () {
  it('creates a patch', async function () {
    const result = await withSession(({ session }) => {
      session.send.instrument('bass-instrument').to.track('bass-track');
    });

    const session = result.model;
    const patch = session.patches.first();

    expect(session.patches.length).toEqual(1);
    expect(patch.inputType).toEqual('instrument');
    expect(patch.input).toEqual('bass-instrument');
    expect(patch.outputType).toEqual('track');
    expect(patch.output).toEqual('bass-track');
  });
});

describe('#send.track().to.track()', function () {
  it('creates a patch', async function () {
    const result = await withSession(({ session }) => {
      session.send.track('bass-track').to.track('main');
    });

    const session = result.model;
    const patch = session.patches.first();

    expect(session.patches.length).toEqual(1);
    expect(patch.inputType).toEqual('track');
    expect(patch.input).toEqual('bass-track');
    expect(patch.outputType).toEqual('track');
    expect(patch.output).toEqual('main');
  });
});

describe('#send.track().to.main()', function () {
  it('creates a patch', async function () {
    const result = await withSession(({ session }) => {
      session.send.track('bass-track').to.main();
    });

    const session = result.model;
    const patch = session.patches.first();

    expect(session.patches.length).toEqual(1);
    expect(patch.inputType).toEqual('track');
    expect(patch.input).toEqual('bass-track');
    expect(patch.outputType).toEqual('track');
    expect(patch.output).toEqual('main');
  });
});

describe('#send.instrument().to.track("main")', function () {
  it('throws an error', async function () {
    await expect(withSession(({ session }) => {
      session.send.instrument('bass-instrument').to.track('main');
    }))
      .rejects
      .toThrow('Instruments cannot be sent directly to the main output.');
  });
});

describe('#send.track().to.effect()', function () {
  it('creates a patch', async function () {
    const result = await withSession(({ session }) => {
      session.send.track('bass-track').to.effect('reverb-effect');
    });

    const session = result.model;
    const patch = session.patches.first();

    expect(session.patches.length).toEqual(1);
    expect(patch.inputType).toEqual('track');
    expect(patch.input).toEqual('bass-track');
    expect(patch.outputType).toEqual('effect');
    expect(patch.output).toEqual('reverb-effect');
  });
});

describe('#send.effect().to.track()', function () {
  it('creates a patch', async function () {
    const result = await withSession(({ session }) => {
      session.send.effect('reverb-effect').to.track('main');
    });

    const session = result.model;
    const patch = session.patches.first();

    expect(session.patches.length).toEqual(1);
    expect(patch.inputType).toEqual('effect');
    expect(patch.input).toEqual('reverb-effect');
    expect(patch.outputType).toEqual('track');
    expect(patch.output).toEqual('main');
  });
});

describe('#send.effect().to.main()', function () {
  it('creates a patch', async function () {
    const result = await withSession(({ session }) => {
      session.send.effect('reverb-effect').to.main();
    });

    const session = result.model;
    const patch = session.patches.first();

    expect(session.patches.length).toEqual(1);
    expect(patch.inputType).toEqual('effect');
    expect(patch.input).toEqual('reverb-effect');
    expect(patch.outputType).toEqual('track');
    expect(patch.output).toEqual('main');
  });
});
