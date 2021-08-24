import { Logger } from '@composer/util';
import { render } from '@composer/compose';

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

  get changed () {
    return this.file.source !== this.renderedSource;
  }

  constructor({ workspace, templates }) {
    this.workspace = workspace;
    this.templates = templates;
    this.renderedSource = null;
    this.listeners = {};

    this.logger = new Logger('Controller');

    this.allow('error');
    this.allow('changed');

    this.allow('transport:start');
    this.allow('transport:stop');
    this.allow('transport:pause');
    this.allow('transport:loop');
    this.allow('transport:position');

    this.allow('file:selected');
    this.allow('file:created');
    this.allow('file:destroyed');
    this.allow('file:updated');

    // Observe transport events directly from audio driver
    [
      'start',
      'stop',
      'pause',
      'loop',
    ].forEach((eventName) => {
      this.audio.on(eventName, () => {
        this.emit(`transport:${eventName}`, this.state);
      });
    });

    document.title = 'Harmonicon';
  }


  // Actions
  // -------

  async addFile() {
    try {
      const file = await this.workspace.files.create({
        name: 'Untitled',
        source: this.templates.blank,
        workspace: this.workspace,
      });

      this.emit('file:created', file);
      this.selectFile(file);
    }
    catch (e) {
      console.error(e);
      this.emit('error', { message: 'Unable to add a new file.' });
    }
  }

  async destroyFile(file) {
    try {
      await this.workspace.files.destroy(file);

      if (file.id === this.file.id) {
        this.selectFile(this.workspace.files.first());
      }
      else {
        this.emit('file:destroyed', file);
      }
    }
    catch (e) {
      console.error(e);
      this.emit('error', { message: 'Unable to delete file.' });
    }
  }

  async save() {
    try {
      await this.file.save();
      await this.workspace.save(); 
    }
    catch (e) {
      console.error(e);
      this.emit('error', { message: 'Unable to save workspace.' });
    }
  }

  async selectFile(file) {
    try {
      this.file = file;
      this.emit('file:selected', file);
      return file;
    }
    catch (e) {
      console.error(e);
      this.emit('error', { message: 'Unable to select file.' });
    }
  }

  async play() {
    try {
      await this.withRendered(async () => {
        return this.audio.play();
      });
    }
    catch (e) {
      console.error(e);
      this.emit('error', { message: 'Unable to play this file :-(' });
    }
  }

  async stop() {
    try {
      await this.withRendered(async () => {
        await this.audio.stop();

        this.emit('transport:position', {
          measure: 0,
          beat: 0,
          subdivision: 0,
        })
      });
    }
    catch (e) {
      console.error(e);
      this.emit('error', { message: 'Unable to stop audio, oh noes!' });
    }
  }

  async pause() {
    try {
      await this.withRendered(async () => {
        return this.audio.pause();
      });
    }
    catch (e) {
      console.error(e);
      this.emit('error', { message: 'Unable to pause audio, oh noes!' });
    }
  }


  // Convenience setters
  // -------------------

  setFileSource (source) {
    this.file.setProperties({ source });
    this.emit('changed', this.changed);
  }



  // Events
  // ------

  allow(eventName) {
    this.listeners[eventName] = [];
  }

  on(eventName, fn) {
    if (typeof this.listeners[eventName] === 'undefined') {
      throw new Error(`Unregistered event name "${eventName}"`);
    }

    this.listeners[eventName].push(fn);
  }

  emit(eventName, payload) {
    if (typeof this.listeners[eventName] === 'undefined') {
      throw new Error(`Unregistered event name "${eventName}"`);
    }

    console.log(`emit ${eventName} to ${this.listeners[eventName].length} listener(s)`);

    (this.listeners[eventName] || []).forEach((fn) => {
      fn(payload);
    });
  }


  // Rendering
  // ---------

  async withRendered(fn) {
    if (this.changed) {
      await this.render();
    }

    return fn();
  }

  async render () {
    await this.audio.reset();

    const { composer, renderer } = await render({
      code: this.file.source
    }, this.audio);

    this.composer = composer;
    this.renderer = renderer;
    this.renderedSource = this.file.source;

    this.audio.observePosition((position) => {
      this.emit('transport:position', position);
    });
  }

}
