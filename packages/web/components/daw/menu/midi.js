import {
  MenuDropdownItem,
  MenuDropdownDivider,
  MenuDropdownHeader,
} from '@composer/web-components';

import { useState } from 'react';
import { useMidi } from '../providers/midi';

import { IoRefreshSharp, IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineCable } from "react-icons/md";
import { useController } from '../providers/controller';

export function MidiDropdown() {
  const midi = useMidi();
  const controller = useController();

  // Current selected devices
  const [ keyboardInput, setKeyboardInput ] = useState(null);

  // Available inputs and outputs
  const [ inputs, setInputs ] = useState([]);
  const [ outputs, setOutputs ] = useState([]);

  // Is browser authorized?
  const [ authorized, setAuthorized ] = useState(false);

  // Assign device to keyboard panel input
  const assignKeyboardInput = (device) => {
    if (keyboardInput === device) {
      controller.releaseAssignedMidiDevice('keyboard');
      setKeyboardInput(null);
    }
    else {
      controller.assignMidiDevice('keyboard', device);
      setKeyboardInput(device);  
    }
  }

  // Authorize access to browser's MIDI API
  const authorize = async (e) => {
    e.stopPropagation();

    if (await midi.authorize()) {
      setAuthorized(true);
      setInputs(midi.inputs);
      setOutputs(midi.outputs);

      // Re-assign same device
      if (keyboardInput) {
        const currentDevice = midi.inputs.filter((i) => (i.id === keyboardInput.id))[0];

        if (currentDevice) {
          assignKeyboardInput(currentDevice);
        }
      }

      // If there's only one device, autoassign it
      else if (midi.inputs.length === 1) {
        assignKeyboardInput(midi.inputs[0]);
      }
    }
  }

  return (
    <div>
      <MenuDropdownItem
        label="Connect..."
        icon={MdOutlineCable}
        onClick={authorize}
        disabled={authorized}
      />

      <MenuDropdownHeader label="Keyboard Input" />
      {inputs.length > 0 ? (
        inputs.map((device) => (
          <MenuDropdownItem
            key={device.id}
            label={device.name}
            icon={keyboardInput === device ? IoCheckmarkSharp : undefined}
            onClick={() => {
              assignKeyboardInput(device)
            }}
          />
        ))
      ) : (
        <MenuDropdownItem
          label="None"
          disabled={true}
        />
      )}

      <MenuDropdownDivider />
      <MenuDropdownItem
        label="Refresh"
        icon={IoRefreshSharp}
        onClick={authorize}
        disabled={!authorized}
      />
    </div>
  )
}