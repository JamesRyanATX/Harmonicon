import { ToneDriver, Tone } from '@composer/driver-tone';
import { SessionComposer, parse } from '@composer/compose';

export function Remote () {
  window.SessionComposer = SessionComposer;
  window.SessionComposer.parse = parse;
  window.ToneDriver = ToneDriver;
  window.Tone = Tone;

  return (
    <div>
      player!
    </div>
  )
}