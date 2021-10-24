import { ToneAudioDriver, Tone } from '@composer/driver-audio-tone';
import { SessionComposer, render } from '@composer/compose';

export function Remote () {
  window.SessionComposer = SessionComposer;
  window.SessionComposer.render = render;
  window.ToneAudioDriver = ToneAudioDriver;
  window.Tone = Tone;

  return (
    <div>
      player!
    </div>
  )
}