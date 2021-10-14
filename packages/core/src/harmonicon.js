import { Console, Logger, eventify, mapSeries } from '@composer/util';
import { WorkspaceModel } from './models/workspace';
import { InitializationError } from './errors';
import { config } from './config';

export class Harmonicon {

  // Console to use for logging
  static console = null;

  // The active workspace containing open sessions, UI settings etc.
  static workspace = null;

  // Active audio and storage drivers (external modules)
  static get drivers() {
    return config.drivers;
  };

  // Libraries available to sessions
  static get libraries() {
    return config.libraries;
  };

  /**
   * Remove all libraries and drivers
   */
  static teardown() {
    config.libraries = {};
    config.drivers = {};
  }

  static async initialize({
    workspace = true,
    libraries = [],
    drivers = { audio: null, storage: null, midi: null },
  }) {

    // set drivers
    config.drivers = drivers;

    // install libraries
    await mapSeries(libraries, async (library) => this.install(library));

    // Check for audio driver
    if (!config.drivers.audio) {
      throw new InitializationError('No audio driver present.');
    }

    // Early return unless we're requesting a workspace
    if (!workspace) {
      return;
    }

    // Check for audio driver
    if (!config.drivers.storage) {
      throw new InitializationError('No storage driver present.');
    }

    this.workspace = await WorkspaceModel.loadOrCreate('default');

    return this.workspace;
  }

  static bootstrap() {
    this.console = new Console();
    this.logger = new Logger('Core.Harmonicon');

    Logger.console = this.console;

    // Composer events
    this.allow('composer:error');
    this.allow('composer:parsing');
    this.allow('composer:parsed');
    this.allow('composer:rendering');
    this.allow('composer:rendered');

    // Player events
    [ 0, 1, 2, 3, 4, 5, 6, 7 ].forEach((octave) => {
      [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ].forEach((pitch) => {
        Harmonicon.allow(`play:${pitch}${octave}`);
        Harmonicon.allow(`play:${pitch}b${octave}`);
        Harmonicon.allow(`play:${pitch}#${octave}`);
      })
    });

    if (typeof window !== 'undefined') {
      window.Harmonicon = this;
    }
  }

  /**
   * Install a library.
   * 
   * @example
   * Harmonicon.use(CoreLibrary)
   * 
   * @example
   * await Harmonicon.use({
   *   name: 'test',
   *   build: async () => { return library(... )}
   * })
   * 
   * @param {Object} library 
   * @param {String} library.name - name of library
   * @param {Object} library.model - if already rendered, the resulting library model
   * @param {Function} library.build - if lazy loading, a function to build the library
   * @returns {Promise|void}
   */
  static async install(library) {
    this.libraries[library.name] = library.build 
      ? (await library.build()).model 
      : library.model;
  }

  /**
   * Uninstall a library by name or object with a name property
   * 
   * @param {Object|String} library - string name or object with name property
   * @param {String} library.name - name of library to uninstall
   */
  static uninstall(library) {
    if (typeof library === 'string') {
      delete this.libraries[library];
    }
    else {
      delete this.libraries[library.name];
    }
  }

  static getDeviceById(id) {
    const [ libraryName, deviceType, deviceName ] = id.split('.');

    if (!libraryName || !deviceType || !deviceName) {
      return null;
    }
    else {
      return this.libraries[libraryName][`${deviceType}s`].filterByProperty('name', deviceName)[0];
    }
  }

}

eventify(Harmonicon).bootstrap();
