import { eventify } from '@composer/util';

export class Harmonicon {
  static libraries = {};

  static bootstrap() {

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

}

eventify(Harmonicon).bootstrap();
