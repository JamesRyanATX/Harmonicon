import { useState } from 'react';
import { Tabs, Tab, TabIcon, useEventListener } from '@composer/daw-components';
import { IoAddCircleOutline } from "react-icons/io5";
import { useController } from './providers/controller';


function FileTab({
  file,
  controller,
  selected,
}) {
  const [ name, setName ] = useState(file.name);

  useEventListener(file, 'changed:name', ({ newValue }) => {
    setName(newValue);
  });

  return (
    <Tab
      key={file.id}
      label={name}
      selected={selected}
      onTabClick={() => {
        controller.selectFile(file);
      }}
      onCloseClick={() => {
        if (confirm('Are you sure you want to delete this file?')) {
          controller.destroyFile(file);
        }
      }}
    />
  )
}

export function Switcher () {
  const controller = useController();

  const [ loaded, setLoaded ] = useState(false);
  const [ files, setFiles ] = useState(controller.workspace.files.all);
  const [ selectedFile, setSelectedFile ] = useState(controller.file);

  function updateFiles () {
    setFiles(controller.workspace.files.all);
  }

  if (!loaded) {
    controller.on('file:created', updateFiles);
    controller.on('file:destroyed', updateFiles);
    controller.on('file:selected', setSelectedFile);

    setLoaded(true);
  }

  return (
    <Tabs>
      {files.map((file) => (
        <FileTab
          key={file.id}
          file={file}
          controller={controller}
          selected={selectedFile.id === file.id}
          />
      ))}
      <Tab>
        <TabIcon
          onClick={controller.addFile.bind(controller)}
          icon={IoAddCircleOutline}
        />
      </Tab>
    </Tabs>
  )
}