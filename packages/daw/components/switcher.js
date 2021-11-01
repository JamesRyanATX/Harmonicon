import { useEffect, useState } from 'react';
import { Tabs, Tab, TabIcon, useEventListener } from '@composer/daw-components';
import { IoAddCircleOutline } from "react-icons/io5";
import { useController } from './providers/controller';


function FileTab({
  file,
  controller,
  selected,
}) {
  const [ name, setName ] = useState(file.name);

  useEventListener(file, 'changed:name', function onNameChanged ({ newValue }) {
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

  const [ files, setFiles ] = useState(controller.workspace.files.all);
  const [ selectedFile, setSelectedFile ] = useState(controller.file);

  function updateFiles () {
    setFiles(controller.workspace.files.all);
  }

  function updateSelectedFile (file) {
    setSelectedFile(file);
  }

  useEventListener(controller, 'file:created', updateFiles);
  useEventListener(controller, 'file:destroyed', updateFiles);
  useEventListener(controller, 'file:selected', updateSelectedFile);

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