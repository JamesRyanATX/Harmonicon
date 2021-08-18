import { Tabs, NewTab, Tab } from './switcher/tabs';
import { IoMusicalNotesSharp } from "react-icons/io5";

export function Switcher ({ controller }) {
  return (
    <Tabs>
      <Tab
        label="Playground"
        icon={IoMusicalNotesSharp}
        onMenuClick={() => {
          console.error('tab menu not implemented');
        }}
        selected
      />
      <NewTab 
        onClick={() => {
          console.error('new tab not implemented');
        }}
      />
    </Tabs>
  )
}