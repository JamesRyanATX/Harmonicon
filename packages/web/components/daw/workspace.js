import { useState, useEffect } from "react";
import { useController } from './providers/controller';
import { FileContext } from './providers/file';

export function Workspace({
  workspace,
  children,
}) {
  const controller = useController();

  const [ file, setFile ] = useState();

  useEffect(async () => {
    controller.on('file:selected', setFile);

    if (workspace.files.length === 0) {
      await workspace.files.create({
        name: 'Demo',
        source: Harmonicon.libraries.core.demos.filterByProperty('name', 'Kitchen Sync')[0].source,
      });
    }

    const selectedFile = (() => {
      const selectedFileId = workspace.selectedFile;

      if (selectedFileId) {
        return workspace.files.filterByProperty('id', selectedFileId)[0];
      }
      else {
        return workspace.files.records[0];
      }
    })();

    controller.selectFile(selectedFile);
  }, [ controller ]);

  return file ? (
    <FileContext.Provider value={file}>
      {children}
    </FileContext.Provider>
  ) : '';
}