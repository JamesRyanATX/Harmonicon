import { Logger } from '@composer/util';
import { ComposerError, render } from '@composer/compose';
import { Harmonicon } from '@composer/core';
import { saveAs } from 'file-saver';

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

  constructor({ workspace }) {
    this.workspace = workspace;
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

    this.allow('composer:parsing');
    this.allow('composer:parsed');
    this.allow('composer:rendering');
    this.allow('composer:rendered');

    this.allow('workspace:panels:changed');
    this.allow('workspace:panels:library:show');
    this.allow('workspace:panels:library:hide');
    this.allow('workspace:panels:routes:show');
    this.allow('workspace:panels:routes:hide');
    this.allow('workspace:panels:chords:show');
    this.allow('workspace:panels:chords:hide');
    this.allow('workspace:panels:keyboard:show');
    this.allow('workspace:panels:keyboard:hide');
    this.allow('workspace:panels:console:show');
    this.allow('workspace:panels:console:hide');

    // Observe global Harmonicon events
    Harmonicon.on('composer:error', () => {
      this.emit('error', { message: e.message, error: e })
    });

    Harmonicon.on('composer:parsing', (c) => (this.emit('composer:parsing', c)));
    Harmonicon.on('composer:parsed', (c) => (this.emit('composer:parsed', c)));
    Harmonicon.on('composer:rendering', (c) => (this.emit('composer:rendering', c)));
    Harmonicon.on('composer:rendered', (c) => (this.emit('composer:rendered', c)));

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

    // Fan out panel changes
    this.on('workspace:panels:changed', ({ panel, action }) => {
      this.emit(`workspace:panels:${panel}:${action}`, {});
    });

    this.on('error', ({ message, error }) => {
      if (error) {
        Harmonicon.console.error(error);
      }
      Harmonicon.console.error(message);
    })

    document.title = 'Harmonicon';
    
    // // Should not need this!
    // window.addEventListener('unhandledrejection', function (e) {
    //   if (e.reason instanceof ComposerError) {
    //     this.emit('error', { message: e.reason.message, error: e.reason });
    //     e.cancelBubble = true;
    //     e.stopPropagation();
    //     e.stopImmediatePropagation();
    //   }
    // }.bind(this));
  }


  // Workspace Layout Actions
  // ------------------------

  async showPanel(panel) {
    try {
      this.workspace.panels[panel].enabled = true;
      this.emit(`workspace:panels:changed`, { panel, action: 'show' });  
      return this.workspace.save();
    }
    catch (e) {
      console.error(e);
    }
  }

  async hidePanel(panel) {
    try {
      this.workspace.panels[panel].enabled = false;
      this.emit(`workspace:panels:changed`, { panel, action: 'hide' });  
      return this.workspace.save();
    }
    catch (e) {
      console.error(e);
    }
  }

  async togglePanel(panel) {
    return this[this.workspace.panels[panel].enabled ? 'hidePanel' : 'showPanel'](panel);
  }

  async toggleLibraryPanel() {
    return this.togglePanel('library');
  }

  async toggleRoutesPanel() {
    return this.togglePanel('routes');
  }

  async toggleChordsPanel() {
    return this.togglePanel('chords');
  }

  async toggleKeyboardPanel() {
    return this.togglePanel('keyboard');
  }

  async toggleConsolePanel() {
    return this.togglePanel('console');
  }


  // Session Actions
  // ---------------

  async playNote({ note, instrument }) {
    try {
      this.audio.playNote({ note, instrument, renderer: this.renderer });
    }
    catch (e) {
      console.error(e);

      this.emit('error', {
        message: 'Unable to play audio.',
        error: e
      });
    }
  }

  async addFile({
    name = null,
    source = null
  } = {}) {
    try {
      const file = await this.workspace.files.create({
        name: name || this.newFileName(),
        source: source || Harmonicon.libraries.core.templates.filterByProperty('name', 'Blank')[0].source,
        workspace: this.workspace,
      });

      this.emit('file:created', file);
      this.selectFile(file);
    }
    catch (e) {
      console.error(e);

      this.emit('error', {
        message: 'Unable to add a new file.',
        error: e
      });
    }
  }

  async destroyFile(file) {
    try {
      await this.workspace.files.destroy(file);

      if (file.id === this.file.id) {
        this.selectFile(this.workspace.files.first());
      }

      this.emit('file:destroyed', file);
    }
    catch (e) {
      console.error(e);

      this.emit('error', {
        message: 'Unable to delete file.',
        error: e
      });
    }
  }

  async save() {
    try {
      await this.file.save();
      await this.workspace.save(); 
    }
    catch (e) {
      console.error(e);

      this.emit('error', {
        message: 'Unable to save workspace.',
        error: e,
      });
    }
  }

  async selectFile(file) {
    try {
      this.file = file;
      this.workspace.setProperties({  selectedFile: file.id });
      this.workspace.save();

      this.emit('file:selected', file);
      return file;
    }
    catch (e) {
      console.error(e);

      this.emit('error', {
        message: 'Unable to select file.',
        error: e
      });
    }
  }

  async play() {
    try {
      await this.withInteractiveRendering(async () => {
        return this.renderer.play();
      });
    }
    catch (e) {
      this.emit('error', {
        message: 'Unable to play this file :-(',
        error: e
      });
    }
  }

  async stop() {
    try {
      await this.renderer.stop();

      this.emit('transport:position', {
        measure: 0,
        beat: 0,
        subdivision: 0,
      });
    }
    catch (e) {
      console.error(e);

      this.emit('error', {
        message: 'Unable to stop audio, oh noes!',
        error: e,
      });
    }
  }

  async pause() {
    try {
      await this.renderer.pause();
    }
    catch (e) {
      this.emit('error', {
        message: 'Unable to pause audio, oh noes!',
        error: e
      });
    }
  }

  async exportToWav() {
    try {
      await this.withExportableRendering(async ({ renderer, duration }) => {
        saveAs(await renderer.toWav({ duration }), `${this.file.name}.wav`);
      });
    }
    catch (e) {
      this.emit('error', {
        message: 'Unable to export to WAV; see console for details.',
        error: e
      });
    }
  }

  async exportToMp3() {
    try {
      await this.withExportableRendering(async ({ renderer, duration }) => {
        saveAs(await renderer.toMp3({ duration }), `${this.file.name}.mp3`);
      });
    }
    catch (e) {
      this.emit('error', {
        message: 'Unable to export to MP3; see console for details.',
        error: e
      });
    }
  }


  // Convenience setters
  // -------------------

  setFileSource (source) {
    this.file.setProperties({ source });
    this.file.save();
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

  async withExportableRendering(fn) {
    return this.withInteractiveRendering(async () => {

      // Temporary hack until this can be computed more reliably
      const duration = this.renderer.cache.events.last
        ? this.renderer.session.elapsedTimeAtPosition(this.renderer.cache.events.last.at)
        : 0;

      await this.withBackgroundRendering({ duration }, async ({ renderer, composer }) => {
        return fn({ renderer, composer, duration });
      });
    });
  }

  async withBackgroundRendering({ duration }, fn) {
    return fn(await this.createBackgroundRendering({ duration }));
  }

  async createBackgroundRendering({ duration }) {
    await this.audio.startAudioBuffer();

    return this.createRendering({
      interactive: false,
      duration
    });
  }

  async withInteractiveRendering(fn) {
    if (this.changed) {
      await this.createInteractiveRendering();
    }

    return fn();
  }

  async createInteractiveRendering () {
    await this.audio.startAudioBuffer();

    const { composer, renderer } = await this.createRendering({
      interactive: true,
    })

    this.composer = composer;
    this.renderer = renderer;
    this.renderedSource = this.file.source;

    this.renderer.observePosition((position) => {
      this.emit('transport:position', position);
    });
  }

  async createRendering({ interactive, duration }) {
    await this.audio.startAudioBuffer();

    return render({ code: this.file.source, interactive, duration });
  }

  // Misc
  // ----

  newFileName () {
    const verbs = [
      'Mad',
      'Extrm',
      'Mega',
      'Tight',
      'Clean',
      'Rad',
      'Cool',
      'Funky',
      'Epic',
      'L33t',
      'ZZZZ',
      'EZ',
      'Flowin',
      'SpAcIn'
    ];

    const nouns = [
      'Beatz',
      'Sesh',
      'Tunz',
      'C0d3',
      'Chart',
      'Piece',
      'Song',
      'Rhymz',
      'Ditty',
      'Jam',
      'Jamz',
      'Trax'
    ];

    return [
      verbs[Math.floor(Math.random() * verbs.length)],
      nouns[Math.floor(Math.random() * nouns.length)],
    ].join(' ');
  }

  // Debugging
  // ---------

  wipe () {
    Object.keys(localStorage).forEach((k) => (delete localStorage[k]));
    document.location.reload();
  }

}
