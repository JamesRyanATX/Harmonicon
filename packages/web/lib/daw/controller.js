import { Tone } from '@composer/driver-tone';
import { parse } from '@composer/compose';


export class Controller {

  get state () {
    return this.driver.state;
  }

  get position () {
    return this.driver.position;
  }

  constructor({
    driver,
    source,
    workspace
  }) {
    this.workspace = workspace;
    this.driver = driver;
    this.source = source;
    this.renderedSource = null;
    this.listeners = {};
    this.changed = false;
  }

  // events:
  // - position
  // - state
  // - changed
  //
  on(eventName, fn) {
    this.listeners[eventName] ||= [];
    this.listeners[eventName].push(fn);
  }

  emit(eventName, payload) {
    (this.listeners[eventName] || []).forEach((fn) => {
      fn(payload);
    });
  }

  emitStateAndPosition () {
    this.emit('position', this.position);
    this.emit('state', this.state);
  }

  setSource (source) {
    this.source = window.localStorage.source = source;

    if (this.renderedSource !== null && this.source !== this.renderedSource) {
      this.changed = true;
    }
    else {
      this.changed = false;
    }

    this.emit('changed', this.changed);
  }

  async reload () {
    await this.pause();
    await this.reset();
    await this.prepare();

    this.emit('changed', this.changed = false);
    this.emitStateAndPosition();
  }

  async prepare () {
    if (this.composer && this.renderer) {
      return;
    }

    try {
      this.renderedSource = this.source;
      this.composer = await parse({ code: this.source });
      this.renderer = await this.composer.render(this.driver);
    }
    catch (e) {
      console.error(e);

      this.emit('error', {
        message: e.message,
        error: e
      });

      return;
    }

    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        this.emit('position', this.position);
      }, time);
    }, '8n', 0);

    this.driver.setTransportPosition('0:0:0');
  }

  // Reset Audio buffer (implementation up to driver)
  async reset () {
    await this.driver.reset();

    delete this.renderer;
    delete this.composer;
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

    this.driver.play();
    this.emitStateAndPosition();  
  }

  async pause () {
    await this.driver.pause();

    this.emitStateAndPosition();
  }

  async stop () {
    await this.pause();
    await this.goToBeginning();
  }

  async goToBeginning () {
    await this.driver.setTransportPosition(`0:0:0`);

    this.emitStateAndPosition();
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
    
    this.emitStateAndPosition();
  }

  async goForwardsByMeasure() {
    const {
      measure,
      beat,
      subdivision
    } = this.driver.position;

    await this.driver.setTransportPosition(`${measure + 1}:0:0`);

    this.emitStateAndPosition();
  }

}
