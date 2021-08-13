const synth = new Tone.Synth().toDestination();;
const now = Tone.now();

synth.triggerAttack("C4", now);
synth.triggerRelease(now + 1);