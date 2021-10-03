import { FileModel, Harmonicon, WorkspaceModel } from '../../';
import '../helper';

describe('WorkspaceModel', function () {
  let workspace;

  async function findOrCreateWorkspace(id) {
    return WorkspaceModel.loadOrCreate(id);
  }

  describe('basic tab flow in ui', function () {

    beforeEach(async function () {
      workspace = await findOrCreateWorkspace('default');
    })

    it('maintains the correct storage state', async function () {
      
      // 1. Add a tab
      // ------------

      const file1 = workspace.files.add(await FileModel.create({
        name: 'bob',
        source: 'dole',
        workspace: workspace
      }));

      await workspace.save();

      expect(Harmonicon.drivers.storage.dump()).toEqual({
        [`composer:workspacemodel:${workspace.id}`]: {
          id: workspace.id,
          files: [
            file1.id
          ],
          panels: {
            chords: {
              enabled: true
            },
            console: {
              enabled: true,
            },
            keyboard: {
              enabled: true
            },
            library: {
              enabled: true
            },
            routes: {
              enabled: true
            },
          }
        },
        [`composer:filemodel:${file1.id}`]: {
          id: file1.id,
          name: 'bob',
          source: 'dole',
          type: 'text/javascript',
          workspace: 'default',
        },
      });


      // 2. Make changes
      // ---------------

      file1.setProperties({ source: 'zzzzzzzz' });

      await file1.save();

      expect(Harmonicon.drivers.storage.dump()).toEqual({
        [`composer:workspacemodel:${workspace.id}`]: {
          id: workspace.id,
          files: [
            file1.id
          ],
          panels: {
            chords: {
              enabled: true
            },
            console: {
              enabled: true,
            },
            keyboard: {
              enabled: true
            },
            library: {
              enabled: true
            },
            routes: {
              enabled: true
            },
          }
        },
        [`composer:filemodel:${file1.id}`]: {
          id: file1.id,
          name: 'bob',
          source: 'zzzzzzzz',
          type: 'text/javascript',
          workspace: 'default',
        },
      });


      // 3. Add another tab
      // ------------------

      const file2 = workspace.files.add(await FileModel.create({
        name: 'peter',
        source: 'frampton',
        workspace: workspace
      }));

      await workspace.save();

      expect(Harmonicon.drivers.storage.dump()).toEqual({
        [`composer:workspacemodel:${workspace.id}`]: {
          id: workspace.id,
          files: [
            file1.id,
            file2.id
          ],
          panels: {
            chords: {
              enabled: true
            },
            console: {
              enabled: true,
            },
            keyboard: {
              enabled: true
            },
            library: {
              enabled: true
            },
            routes: {
              enabled: true
            },
          }
        },
        [`composer:filemodel:${file1.id}`]: {
          id: file1.id,
          name: 'bob',
          source: 'zzzzzzzz',
          type: 'text/javascript',
          workspace: 'default',
        },
        [`composer:filemodel:${file2.id}`]: {
          id: file2.id,
          name: 'peter',
          source: 'frampton',
          type: 'text/javascript',
          workspace: 'default',
        },
      });


      // 4. Delete original tab
      // ----------------------

      await workspace.files.destroy(file1);

      expect(Harmonicon.drivers.storage.dump()).toEqual({
        [`composer:workspacemodel:${workspace.id}`]: {
          id: workspace.id,
          files: [
            file2.id
          ],
          panels: {
            chords: {
              enabled: true
            },
            console: {
              enabled: true,
            },
            keyboard: {
              enabled: true
            },
            library: {
              enabled: true
            },
            routes: {
              enabled: true
            },
          }
        },
        [`composer:filemodel:${file2.id}`]: {
          id: file2.id,
          name: 'peter',
          source: 'frampton',
          type: 'text/javascript',
          workspace: 'default',
        },
      });


      // 5. User leaves and comes back, sees work
      // ----------------------------------------

      workspace = await findOrCreateWorkspace('default');

      expect(workspace.toJSON({ deep: true })).toEqual({
        id: 'default',
        files: [
          {
            id: file2.id,
            name: 'peter',
            source: 'frampton',
            type: 'text/javascript',
            workspace: 'default'
          }
        ],
        panels: {
          chords: {
            enabled: true
          },
          console: {
            enabled: true,
          },
          keyboard: {
            enabled: true
          },
          library: {
            enabled: true
          },
          routes: {
            enabled: true
          },
        }
      });
    });
  });

});