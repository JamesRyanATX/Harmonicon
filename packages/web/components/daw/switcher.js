import { Tabs, NewTab, Tab } from './switcher/tabs';
import { IoMusicalNotesSharp } from "react-icons/io5";
import { useState } from 'react';

export function Switcher ({ controller }) {
  const [ loaded, setLoaded ] = useState(false);
  const [ selectedFile, setSelectedFile ] = useState(controller.file);

  if (!loaded) {
    controller.on('file:selected', setSelectedFile);
    setLoaded(true);
  }

  return (
    <Tabs>
      {controller.workspace.files.map((file) => (
        <Tab
          key={file.id}
          label={file.name}
          icon={IoMusicalNotesSharp}
          selected={selectedFile === file}
          onTabClick={() => {
            controller.selectFile(file);
          }}
          onMenuClick={() => {
            console.error('tab menu not implemented');
          }}
        />
      ))}
      <NewTab 
        onClick={controller.addFile.bind(controller)}
      />
    </Tabs>
  )
}