import { useState } from 'react';
import { Transport } from './daw/transport';
import { Editor } from './daw/editor';
import { ToneDriver, Tone } from '@composer/driver-tone';
import { SessionComposer, parse } from '@composer/compose';

import styles from '../styles/daw.module.css';

const DEFAULT_CODE = `
//
// [name] is a music-as-code DAW powered by your browser.
//

session('Example', async ({ session }) => {
  session.at.measure(0)   // At measure 0, do the following
    .meter([ 4, 4 ])      // 4/4 time
    .tempo(160)           // in beats per minute (bpm)
    .swing(0)             // 0 to 1
    .key('C')             // Root note of key (A, C, Db, F# etc.)
    .scale('major');      // Mode/scale (major, minor, ionian, dorian, etc.)

  session.instrument('bass', async () => {
    return new Tone.MembraneSynth().toDestination();
  });

  session.phrase('walk-the-relative-scale', ({ phrase }) => {
    phrase.steps(
      quarter.note(0),    // Play a full octave in the selected mode and tonic
      eighth.note(1),
      eighth.note(2),
      eighth.note(3),
      eighth.note(4),
      eighth.note(5),
      eighth.note(6),
    );
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(0).play.phrase('walk-the-relative-scale');
  });
});
`;

class Controller {

  get state () {
    return this.driver.state;
  }

  get position () {
    return this.driver.position;
  }

  // [TODO]
  get changed () {
    return false;
  }

  constructor({ driver, source }) {
    this.driver = driver;
    this.source = source;

    this.listeners = {
      position: [],
      state: []
    };

    window.controller = this;
    window.SessionComposer = SessionComposer;
    window.ToneDriver = ToneDriver;
    window.Tone = Tone;

    this.updatePositionListeners = this.updatePositionListeners.bind(this);
    this.updateStateListeners = this.updateStateListeners.bind(this);
    this.updateListeners = this.updateListeners.bind(this);

    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(this.updateListeners, time);
    }, "4n");

    //this.updateDisplays({ poll: false });
  }

  registerPositionListener (fn) {
    this.listeners.position.push(fn);
  }

  registerStateListener (fn) {
    this.listeners.state.push(fn);
  }

  updatePositionListeners () {
    console.log(`updatePositionListeners: position = ${JSON.stringify(this.position)}`);
    
    this.listeners.position.forEach((fn) => {
      fn(this.position);
    });
  }

  updateStateListeners () {
    console.log(`updateStateListeners: state = ${this.state}`);

    this.listeners.state.forEach((fn) => {
      fn(this.state);
    });
  }

  updateListeners () {
    this.updateStateListeners();
    this.updatePositionListeners();
  }

  setSource (source) {
    this.source = source;
  }

  async prepare () {
    if (this.composer && this.renderer) {
      return;
    }

    this.composer = await parse({ code: this.source });
    this.renderer = await this.composer.render(ToneDriver);

    this.driver.setTransportPosition('0:0:0');
  }

  // Reset Audio buffer (implementation up to driver)
  async reset () {
    return this.renderer ? this.renderer.reset() : true;
  }

  async playOrPause () {
    if (this.state === 'started') {
      return this.pause();
    }
    else {
      return this.play();
    }
  }

  async play () {
    await this.prepare();
    await this.driver.play();

    this.updateListeners();
  }

  async pause () {
    await this.driver.pause();
    this.updateListeners();
  }

  async goToBeginning () {
    await this.driver.setTransportPosition(`0:0:0`);
    this.updateListeners();
  }

  async goBackwardsByMeasure() {
    const {
      measure,
      beat,
      subdivision
    } = this.driver.position;

    console.log(JSON.stringify(this.driver.position));

    if (beat === 0 && subdivision === 0) {
      return this.driver.setTransportPosition(`${measure - 1}:0:0`);
    }
    else if (measure > 0) {
      return this.driver.setTransportPosition(`${measure - 1}:0:0`);
    }
    
    this.updateListeners();
  }

  async goForwardsByMeasure() {
    const {
      measure,
      beat,
      subdivision
    } = this.driver.position;

    await this.driver.setTransportPosition(`${measure + 1}:0:0`);

    this.updateListeners();
  }


}

export function DAW (props) {
  const [ controller, setController ] = useState(new Controller({
    driver: new ToneDriver(),
    source: DEFAULT_CODE
  }));

  return (
    <div className={styles.daw}>
      <Editor controller={controller} />
      <Transport controller={controller} />
    </div>
  )
}