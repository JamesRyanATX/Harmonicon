# Harmonicon Language Reference

##### Version 1.0.0

## Overview

[Harmonicon](https://harmonicon.studio) is a boutique [DAW](https://en.wikipedia.org/wiki/Digital_audio_workstation) for **composing music as code**.

It focuses on composition over live performance and emphasizes music theory in the songwriting process.

## Features

* Human-readable composition language based in JavaScript
* Browser-based IDE with [Visual Studio Code](https://microsoft.github.io/monaco-editor/) technology
* Tracks, Effects and Sends
* Library of synthesizers and sample-based instruments
* Global key signatures and realtime pitch transposition
* Powered by the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), [Tone.js](https://tonejs.github.io/), [Tonal](https://github.com/tonaljs/tonal), [Monaco](https://microsoft.github.io/monaco-editor/), and [NextJS](https://nextjs.org/).


## Quick Start

This is Hello World! in Harmonicon.  Copy and paste the following snippet into the editor on [harmonicon.studio](https://harmonicon.studio) and press "Play":

``` javascript
// Herein lies a musical greeting
session('hello-world', async ({ library }) => {

  // Create an instrument (in this case, a synthesizer from ToneJS)
  session.instrument('synth', async () => {
    return new Tone.MonoSynth();
  });

  // Create a track
  session.track('synth', async ({ track }) => {
     track.at(0).play(quarter.note('C4'));
  });

  // Send the "synth" instrument to the "synth" track
  session.send.instrument('synth').to.track('synth');

  // Send the "synth" track to the main output
  session.send.track('synth').to.main();
});
```


## Concepts

If you are familiar with DAWs like Pro Tools, Ableton Live, GarageBand, etc., then the concepts
in Harmonicon should be recognizeable.  The primary difference being you interact with them *via code*
instead of a GUI.

### Sessions

Sessions are the top-level compositional object and defines overall details of the composition such
as the time signature, tempo, and key signature.

### Instruments

asdf

### Tracks

asdf

### Notes

asdf

### Sends

asdf

### Effects

asdf