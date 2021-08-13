import { ToneDriver, Tone } from '@composer/driver-tone';

import { 
  whole,
  half,
  quarter,
  eighth,
  sixteenth,
  thirtysecond,
  session,
  SessionComposer
} from '@composer/compose';

export function Player () {
  window.session = session;
  window.whole = whole;
  window.half = half;
  window.quarter = quarter;
  window.eighth = eighth;
  window.sixteenth = sixteenth;
  window.thirtysecond = thirtysecond;

  window.SessionComposer = SessionComposer;
  window.ToneDriver = ToneDriver;
  window.Tone = Tone;

  return (
    <div>
      player!
    </div>
  )
}