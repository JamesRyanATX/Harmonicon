import { Tone } from '@composer/driver-audio-tone';
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

  get changed () {
    return this.source === this.renderedSource;
  }

  constructor({ workspace }) {
    this.workspace = workspace;

    this.source = '';
    this.renderedSource = null;

    this.listeners = {};

    this.allow('error');
    this.allow('state');
    this.allow('changed');
    this.allow('position');

    this.allow('file:selected');
    this.allow('file:created');
    this.allow('file:destroyed');
    this.allow('file:updated');
  }


  // Actions
  // -------

  async addFile() {
    try {
      const file = await this.workspace.files.create({
        name: 'Untitled',
        source: '1;',
      });

      this.emit('file:created', file);
    }
    catch (e) {
      console.error(e);
      this.emit('error', new Error('Unable to add a new file.'));
    }
  }

  async destroyFile() {
    try {
      await this.workspace.save(); 
    }
    catch (e) {
      console.error(e);
      this.emit('error', 'Unable to delete file.');
    }
  }

  async save() {
    try {
      await this.file.save();
      await this.workspace.save(); 
    }
    catch (e) {
      console.error(e);
      this.emit('error', 'Unable to save workspace.');
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
      this.emit('error', 'Unable to select file.');
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
      this.emit('error', new Error('Unable to play this file :-('));
    }
  }

  async stop() {
    try {
      await this.withRendered(async () => {
        return this.audio.pause();
      });
    }
    catch (e) {
      console.error(e);
      this.emit('error', new Error('Unable to stop audio, oh noes!'));
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
      this.emit('error', new Error('Unable to pause audio, oh noes!'));
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

    (this.listeners[eventName] || []).forEach((fn) => {
      fn(payload);
    });
  }


  // Rendering
  // ---------

  async withRendered(fn) {
    if (this.changed) {
      this.render();
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
    this.renderedSource = source;

    this.emit('state', this.state);
    this.emit('position', this.position);
  }


  // Misc
  // ----

  // emitStateAndPosition () {
  //   this.emit('position', this.position);
  //   this.emit('state', this.state);
  // }

  // async reload () {
  //   await this.pause();
  //   await this.reset();
  //   await this.prepare();

  //   this.emit('changed', this.changed = false);
  //   this.emitStateAndPosition();
  // }

  // async prepare () {
  //   if (this.composer && this.renderer) {
  //     return;
  //   }

  //   try {
  //     this.renderedSource = this.source;
  //     this.composer = await parse({ code: this.source });
  //     this.renderer = await this.composer.render(this.audio);
  //   }
  //   catch (e) {
  //     console.error(e);

  //     this.emit('error', {
  //       message: e.message,
  //       error: e
  //     });

  //     return;
  //   }

  //   Tone.Transport.scheduleRepeat((time) => {
  //     Tone.Draw.schedule(() => {
  //       this.emit('position', this.position);
  //     }, time);
  //   }, '8n', 0);

  //   this.audio.setTransportPosition('0:0:0');
  // }

  // // Reset Audio buffer (implementation up to driver)
  // async reset () {
  //   await this.audio.reset();

  //   delete this.renderer;
  //   delete this.composer;
  // }

  // async playOrPause () {
  //   if (this.state === 'started') {
  //     return this.pause();
  //   }
  //   else {
  //     return this.play();
  //   }
  // }

  // async play () {
  //   await this.prepare();

  //   this.audio.play();
  //   this.emitStateAndPosition();  
  // }

  // async pause () {
  //   await this.audio.pause();

  //   this.emitStateAndPosition();
  // }

  // async stop () {
  //   await this.pause();
  //   await this.goToBeginning();
  // }

  // async goToBeginning () {
  //   await this.audio.setTransportPosition(`0:0:0`);

  //   this.emitStateAndPosition();
  // }

}
