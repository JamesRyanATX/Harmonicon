import { build } from '@composer/library-core';
import { useState } from 'react';
import { IoAddSharp, IoCodeSharp, IoCopyOutline, IoMusicalNotesSharp } from 'react-icons/io5';
import { RiSoundModuleFill } from 'react-icons/ri';
import { CgPiano } from 'react-icons/cg';

import {
  Panel,
  Tree,
  TreeGroup,
  TreeItem
} from '@composer/web-components';

import { useController } from '../providers/controller';


const InstrumentTemplate = (record) => (`
session.use.instrument('${record.name}').from.library();
`.trim());

const EffectTemplate = (record) => (`
session.use.effect('${record.name}').from.library();
`.trim());


function Collection({
  collection = [],
  label = null,
  icon = null,
  template = () => (''),
  copy = false,
  create = false,
  onCopy = (record) => { navigator.clipboard.writeText(template(record)); },
  onCreate = (record) => {}
}) {
  return (
    <TreeGroup label={label}>
      {collection.map((record) => {
        return (
          <TreeItem 
            key={record.name}
            label={record.name}
            icon={icon}
            actions={() => {
              return (
                <>
                  {copy ? (
                    <a onClick={() => (onCopy(record))} title="Copy snippet to clipboard">
                      <IoCodeSharp />
                    </a>
                  ) : ''}
                  {create ? (
                    <a onClick={() => (onCreate(record))} title="Open in new tab">
                      <IoAddSharp />
                    </a>
                  ) : ''}
                </>
              );
            }}
          />
        )
      })}
    </TreeGroup>
  );
}

function Instruments({ library }) {
  return (
    <Collection
      collection={library.instruments}
      icon={CgPiano}
      label="Instruments"
      template={InstrumentTemplate}
      copy
    />
  );
}

function Effects({ library }) {
  return (
    <Collection
      collection={library.effects}
      icon={RiSoundModuleFill}
      label="Effects"
      template={EffectTemplate}
      copy
    />
  );
}

function Snippets({ library }) {
  return (
    <Collection
      collection={library.snippets}
      icon={IoCodeSharp}
      label="Snippets"
      copy
    />
  );
}

function Templates({ library }) {
  return (
    <Collection
      collection={library.templates}
      icon={IoMusicalNotesSharp}
      label="Templates"
      onCreate={(record) => {
        controller.addFile({
          source: record.source
        });
      }}
      create
    />
  );
}

function Demos({ library }) {
  const controller = useController();
 
  return (
    <Collection
      collection={library.demos}
      icon={IoMusicalNotesSharp}
      label="Demos"
      onCreate={(record) => {
        controller.addFile({
          name: record.name,
          source: record.source
        });
      }}
      create
    />
  );
}


export function LibraryPanel({ controller }) {
  const [ library, setLibrary ] = useState();

  if (!library) {
    (async () => {
      setLibrary((await build()).model);
    })();
  }

  return (
    <Panel 
      flex={1}
      id="library"
      label="Library"
      onClose={controller.toggleLibraryPanel.bind(controller)}
    >
      {library ? (
        <Tree>
          <Instruments library={library} />
          <Effects library={library} />
          <Snippets library={library} />
          <Templates library={library} />
          <Demos library={library} />
        </Tree>
      ) : ''}
    </Panel>
  )
}