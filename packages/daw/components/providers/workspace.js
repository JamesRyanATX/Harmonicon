import { useState, useEffect, useContext } from "react";
import { useEventListener } from "@composer/daw-components";
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
  demoName = 'Expressions'
}) {
  const controller = useController();
  const logger = useLogger('WorkspaceProvider')

  const [ file, setFile ] = useState();

  useEventListener(controller, 'file:selected', function onFileSelected(file) {
    setFile(file)
  });

  useEffect(() => {
    (async function () {

      // Create a demo file if none exists
      if (workspace.files.length === 0) {
        await workspace.files.create({
          name: 'Demo',
          source: Harmonicon.libraries.core.demos.filterByProperty('name', demoName)[0].source,
        });
      }

      // Auto-select a file
      const selectedFile = (() => {
        const selectedFileId = workspace.selectedFile;
        const selectedFile = workspace.files.filterByProperty('id', selectedFileId)[0];

        if (selectedFile) {
          return selectedFile;
        }
        else {
          return workspace.files.records[0];
        }
      })();

      controller.selectFile(selectedFile);
    })();
  }, []);

  logger.debug('render')

  return (
    <FileProvider file={file}>
      <SessionProvider file={file}>
        {children}
      </SessionProvider>
    </FileProvider>
  );
}