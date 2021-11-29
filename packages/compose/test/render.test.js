import { SessionComposer, render } from '../';
import * as ToneAudioDriver from '@composer/driver-audio-tone';
import * as WebMidiDriver from '@composer/driver-midi-web';
import { Harmonicon, MockStorageDriver, MockAudioDriver, InteractiveRendererModel } from '@composer/core';

global.Tone = ToneAudioDriver.Tone;

describe('render', function () {

  beforeEach(async () => {
    await Harmonicon.initialize({
      drivers: {
        audio: new MockAudioDriver.Driver(),
        midi: new WebMidiDriver.Driver(),
        storage: new MockStorageDriver.Driver(),
      },
      libraries: [],
    });
  });

  it('renders a session', async function () {
    const result = await render({
      code: `
        session('my-song', ({ session }) => {
          session.at(0, 0, 0).meter([ 4, 4 ]);
          session.at(0, 0, 0).tempo(100);
          session.at(0, 0, 0).swing(0.4);
          session.at(0, 0, 0).key('c');
          session.at(0, 0, 0).scale('major');

          session.phrase('phrase-1', expression([
            quarter.note('c4'),
            quarter.note('d4'),
            quarter.note('e4'),
            quarter.note('f4'),
          ]));

          session.instrument('i1', () => {
            return {
              loaded: true
            }
          });

          session.track('t1', ({ track }) => {
            track.at(0).play.phrase('phrase-1');
            track.at(1).play(quarter.note('c4'));
          })

          session.send.instrument('i1').to.track('t1');
          session.send.track('t1').to.main();
        });
      `
    });

    expect(result.composer).toBeInstanceOf(SessionComposer);
    expect(result.renderer).toBeInstanceOf(InteractiveRendererModel);
  });

});