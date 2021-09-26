# Harmonicon Composer API

##### Version 1.0.0

## Overview

[Harmonicon](https://harmonicon.studio) is an experimental [DAW](https://en.wikipedia.org/wiki/Digital_audio_workstation) for **composing music as code**.

It focuses on composition over live performance and emphasizes music theory in the songwriting process.

## Features

* Human-readable composition language based in JavaScript
* Browser-based IDE with [Visual Studio Code](https://microsoft.github.io/monaco-editor/) technology
* Instruments, Tracks, Effects and Sends
* Built-in synthesizers and instrument library
* Key signatures and realtime pitch transposition
* Powered by the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), [Tone.js](https://tonejs.github.io/), [Tonal](https://github.com/tonaljs/tonal), [Monaco](https://microsoft.github.io/monaco-editor/), and [NextJS](https://nextjs.org/).


## Quick Start

This is Hello World! in Harmonicon.  Copy and paste the following snippet into the editor on [harmonicon.studio](https://harmonicon.studio) and press "Play":

``` javascript
// Herein lies a musical greeting
session('hello-world', ({ library }) => {

  // Create an instrument (in this case, a synthesizer from ToneJS)
  session.use('core.instrument.mono-synth').as('synth');

  // Create a track
  session.track('synth', ({ track }) => {
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

**Sessions** define global properties of the composition, like:

* Time Signature
* Key Signature (tonic and mode)
* Tempo
* Swing

### Instruments

**Instruments** are functions that produce sound for tracks.

### Tracks

**Tracks** represent a sequence of notes bound to the session's timeline.

### Phrases

**Phrases** are reusable sequences of notes.

### Sends

**Sends** connect the output of one device to the input of another.

### Effects

**Effects** modify the output of instruments and tracks.