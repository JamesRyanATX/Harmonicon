import { Logger, Task, eventify, meter } from '@composer/util';
import { ComposerError, render } from '@composer/compose';
import { Harmonicon } from '@composer/core';
import { TransportModel, InteractiveRendererModel } from '@composer/core';
import { renderInteractiveTask } from './tasks/render_interactive';


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

  get changed () {
    return this.file.source !== this.renderedSource;
  }

  constructor({ workspace }) {
    this.workspace = workspace;
    this.renderedSource = null;
    this.listeners = {};
    this.midi = { assignments: {} };

    this.logger = new Logger('Web.DAW');
    this.transport = new TransportModel();
    this.renderer = new InteractiveRendererModel();

    this.allow('error');
    this.allow('changed');

    this.allow('modal:open');
    this.allow('modal:close');

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

    // MIDI device assignments
    this.allow('midi:keyboard:assign');
    this.allow('midi:keyboard:release');

    // Observe global Harmonicon events
    Harmonicon.on('composer:error', () => {
      this.emit('error', { message: e.message, error: e })
    });

    // Update filename after parsing
    Harmonicon.on('composer:parsed', (composer) => {
      this.file.name = composer.name;
    });

    Harmonicon.on('composer:parsing', (c) => (this.emit('composer:parsing', c)));
    Harmonicon.on('composer:parsed', (c) => (this.emit('composer:parsed', c)));
    Harmonicon.on('composer:rendering', (c) => (this.emit('composer:rendering', c)));

    // Fan out panel changes
    this.on('workspace:panels:changed', ({ panel, action }) => {
      this.emit(`workspace:panels:${panel}:${action}`, {});
    });

    this.initializeMeters();

    this.on('error', ({ message, error }) => {
      if (error) {
        Harmonicon.console.error(error);
      }
      Harmonicon.console.error(message);
    })

    document.title = 'Harmonicon';
  }

  initializeMeters () {
    const options = {
      interval: 10000, 
      logger: this.logger
    };

    this.meters = {
      saveFile: meter(() => {
        return this.file.save();
      }, { ...options, name: 'save-file' }),

      saveWorkspace: meter(() => {
        return this.workspace.save();
      }, { ...options, name: 'save-workspace' })
    };
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


  // MIDI Actions
  // ------------

  assignMidiDevice(assignment, device) {
    const currentDevice = this.midi.assignments[assignment];

    if (currentDevice === device || !device) {
      return;
    }
    else if (currentDevice) {
      this.releaseAssignedMidiDevice(assignment);
    }

    device.activate();

    this.midi.assignments[assignment] = device;
    this.emit(`midi:${assignment}:assign`, device);

    this.logger.info(`assigned MIDI device ${device.name} to ${assignment}`)
  }

  releaseAssignedMidiDevice(assignment) {
    const device = this.midi.assignments[assignment];
    device.deactivate();
    this.logger.info(`released MIDI device ${device.name} from ${assignment}`)
    this.emit(`midi:${assignment}:release`, device);
    this.midi.assignments[assignment] = null;
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
      name = name || this.newFileName();
      source = (
        source || Harmonicon.libraries.core.templates.filterByProperty('name', 'Blank')[0].source
      ).replace('my-song', name);

      const file = await this.workspace.files.create({
        workspace: this.workspace, name, source
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

      if (this.workspace.files.length === 0) {
        this.selectFile(null);
      }
      else if (file.id === this.file.id) {
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

  saveFile({ metered = true } = {}) {
    if (metered) {
      return this.meters.saveFile();
    }
    else {
      return this.file.save();
    }
  }

  saveWorkspace({ metered = true } = {}) {
    if (metered) {
      return this.meters.saveWorkspace();
    }
    else {
      return this.workspace.save();
    }
  }

  async save({
    file = true,
    workspace = true,
    metered = false,
  } = {}) {
    try {
      file ? await this.saveFile({ metered }) : 1;
      workspace ? await this.saveWorkspace({ metered }) : 1;
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
      this.workspace.selectedFile = file ? file.id : null;
      this.saveWorkspace();

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

  // TODO-- remove dependency between this and transport and actions
  async play() {
    await this.withInteractiveRendering(async () => {
      return this.transport.play({ position: this.position });
    });
  }


  // Convenience setters
  // -------------------

  setFileSource (source) {
    this.file.setProperties({ source });
    this.saveFile();
    this.emit('changed', this.changed);
  }


  // Timeline
  // --------

  setPosition(position) {
    this.position = position;

    if (this.renderer) {
      this.renderer.setPosition(position);
    }

    this.emit('transport:position', this.position);
  }

  setPlayFrom(playFrom) {
    if (this.renderer) {
      this.renderer.setProperties({ playFrom });
    }

    this.setPosition(playFrom);
  }

  setLoop(from, to) {
    this.loop = { from, to };

    if (this.renderer) {
      this.renderer.setLoop(from, to);
    }

    this.emit('transport:loop', this.loop);
  }


  // Rendering
  // ---------

  async withExportableRendering(fn, { sampleRate } = {}) {
    return this.withInteractiveRendering(async ({ renderer }) => {

      // Temporary hack until this can be computed more reliably
      const duration = this.renderer.cache.events.last
        ? renderer.session.elapsedTimeAtPosition(renderer.cache.events.last.at) + 5
        : 0;

      return await this.withBackgroundRendering(async ({ renderer, composer }) => {
        return fn({ renderer, composer, duration });
      }, { duration, sampleRate });
    });
  }

  async withBackgroundRendering(fn, { duration, sampleRate }) {
    return fn(await this.createBackgroundRendering({ duration, sampleRate }));
  }

  async createBackgroundRendering({ duration, sampleRate }) {
    await this.audio.startAudioBuffer();

    return this.createRendering({
      interactive: false,
      duration, sampleRate
    });
  }

  async withInteractiveRendering(fn) {
    if (this.changed) {
      return fn({ renderer: await this.createInteractiveRendering() });
    }
    else {
      return fn({ renderer: this.renderer });
    }
  }

  async createInteractiveRendering () {
    const task = renderInteractiveTask({
      code: controller.file.source,
      controller: this
    });

    // task.on('error', (error) => {
    //   this.logger.info(`#createInteractiveRendering() error`);
    // });

    // task.on('done', () => {
    //   this.logger.info(`#createInteractiveRendering() done`);
    // });

    // task.on('success', ({ session, composer, renderer }) => {
    //   this.logger.info(`#createInteractiveRendering() success`);
    // });

    const { session, composer, renderer } = await this.transport.blockWhile(task);

    // Save things we need for later
    this.session = session;
    this.composer = composer;
    this.renderer = this.transport.renderer = renderer;

    // For diffs and change detection
    this.renderedSource = this.file.source;
    this.renderedFile = this.file;

    this.emit('composer:rendered', renderer);

    return renderer;
  }

  async createRendering({
    interactive,
    duration,
    sampleRate
  }) {
    await this.audio.startAudioBuffer();

    return render({ code: this.file.source, interactive, duration, sampleRate });
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

eventify(Controller.prototype);