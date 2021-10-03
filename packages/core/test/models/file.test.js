import { FileModel, Harmonicon } from '../../';
import '../helper';

describe('FileModel', function () {
  let workspace;

  beforeEach(() => {
    workspace = Harmonicon.workspace;
  });

  describe('#constructor', function () {
    it('generates an id', async function () {
      const file = FileModel.parse({
        name: 'bobby',
        source: 'hill'
      });

      expect(file.id).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
      expect(file.name).toEqual('bobby');
      expect(file.source).toEqual('hill');
    });
  });

  describe('.create', function () {
    it('creates and saves a record', async function () {

      const file = await FileModel.create({
        name: 'bobby',
        source: 'hill',
        workspace
      });

      expect(file).toBeInstanceOf(FileModel);
    });
  })

  describe('.find', function () {
    it('returns a session by id', async function () {
      const newFile = await FileModel.create({
        name: 'bobby',
        source: 'hill',
        workspace
      });

      const file = await FileModel.find(newFile.id, workspace.storage);

      expect(file.id).toMatch(newFile.id);
      expect(file.name).toEqual('bobby');
      expect(file.source).toEqual('hill');
    });

    it.todo('throws error if not found');
  });

  describe('#save', function () {
    it('saves a record', async function () {
      const file = await FileModel.parse({
        name: 'bobby',
        source: 'hill',
        workspace
      });

      expect(await file.save()).toEqual(true);
    });
  })
})