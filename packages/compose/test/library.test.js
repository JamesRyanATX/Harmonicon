import { LibraryModel } from '@composer/core';
import { library, LibraryComposer } from '../';

describe('library', function () {
  it('creates a library', function () {
    const libraryComposer = library('core', () => (true));

    expect(libraryComposer).toBeInstanceOf(LibraryComposer);
    expect(libraryComposer.model).toBeInstanceOf(LibraryModel);
    expect(libraryComposer.model.name).toEqual('core');
  });
});