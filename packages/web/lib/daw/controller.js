import { Tone } from '@composer/driver-tone';
import { parse } from '@composer/compose';


export class Controller {

  get audio () {
    return this.workspace.audio;
  }

  get storage () {
    return this.workspace.storage;
  }

  get state () {
    return this.audio.state;
  }

  get position () {
    return this.audio.position;
  }

  constructor({ workspace }) {
    this.workspace = workspace;

    this.changed = false;
    this.source = '';
    this.renderedSource = null;

    this.listeners = {};
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
      this.renderer = await this.composer.render(this.audio);
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

    this.audio.setTransportPosition('0:0:0');
  }

  // Reset Audio buffer (implementation up to driver)
  async reset () {
    await this.audio.reset();

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

    this.audio.play();
    this.emitStateAndPosition();  
  }

  async pause () {
    await this.audio.pause();

    this.emitStateAndPosition();
  }

  async stop () {
    await this.pause();
    await this.goToBeginning();
  }

  async goToBeginning () {
    await this.audio.setTransportPosition(`0:0:0`);

    this.emitStateAndPosition();
  }

}
