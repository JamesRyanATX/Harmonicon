import { useState, useEffect, useContext } from "react";
import { useController, ControllerContext } from './controller';
import { useLogger } from './logger';
import { FileProvider } from './file';
import { SessionProvider } from './session';

export function useWorkspace() {
  return useContext(ControllerContext).workspace;
}

export function WorkspaceProvider({
  workspace,
  children,
}) {
  const controller = useController();
  const logger = useLogger('WorkspaceProvider')

  const [ file, setFile ] = useState();

  useEffect(async () => {
    controller.on('file:selected', setFile);

    if (workspace.files.length === 0) {
      await workspace.files.create({
        name: 'Demo',
        source: Harmonicon.libraries.core.demos.filterByProperty('name', 'Expressions')[0].source,
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

  logger.debug('render')

  return file ? (
    <FileProvider file={file}>
      <SessionProvider file={file}>
        {children}
      </SessionProvider>
    </FileProvider>
  ) : '';
}