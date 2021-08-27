import { mapSeries } from '@composer/util';

export const extendable = Base => class extends Base {
  static libraries = {};

  /**
   * Install an external library of composer objects.
   * 
   * @param {*} library 
   */
   static async use(library) {
    if (typeof library.build !== 'function') {
      throw new TypeError("Provided library cannot be installed.")
    }

    this.libraries[library.name] = (await library.build()).model;
  }

  static async initializeLibraries() {
    await mapSeries(this.defaultLibraries, this.use.bind(this));
  }

  use({
    source = 'library',
    collection = 'instruments',
    composer = 'instrument',
    libraryName = 'core',
    name = null
  }) {
    if (source === 'library') {
      const library = this.constructor.libraries[libraryName];
      const item = library[collection].filterByProperty('name', name)[0];

      this[composer](name, item.fn);
    }
    else {
      throw new ComposerError(`Unsupported import source "${source}"`);
    }
  }

}