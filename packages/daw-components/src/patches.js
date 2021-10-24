import React from 'react';
import Graph from "react-graph-vis";

import styles from '../styles/patches.module.css';


export function Patches({
  patches = [],
  instruments = [],
  tracks = [],
  effects = [],
}) {
  const nodes = [ { id: 'track:main', label: 'Main', color: '#F94144' }];
  const edges = [];

  instruments.forEach((instrument) => {
    nodes.push({
      id: `instrument:${instrument.name}`,
      group: 'Instruments',
      label: instrument.name,
    });
  });

  tracks.forEach((track) => {
    nodes.push({
      id: `track:${track.name}`,
      group: 'Tracks',
      label: track.name,
    });
  });

  effects.forEach((effect) => {
    nodes.push({
      id: `effect:${effect.name}`,
      group: 'Effects',
      label: effect.name,
    });
  });

  patches.forEach((patch) => {
    edges.push({
      from: `${patch.inputType}:${patch.input}`,
      to: `${patch.outputType}:${patch.output}`,
    });
  });

  const graph = {
    nodes: nodes,
    edges: edges
  };

  const options = {
    interaction: {
      navigationButtons: true,
      zoomSpeed: 0.5,
    },
    layout: {
      // hierarchical: {
      //   enabled: true,
      //   direction: 'RL',
      //   levelSeparation: 100,
      // }
    },
    groups: {
      Instruments: { 
        color: 'rgb(46, 207, 235)',
      },
      Tracks: {
        color: 'rgb(243, 114, 44)'
      },
      Effects: {
        color: '#90be6d'
      },
    },
    nodes: {
      shape: 'box',
      shapeProperties: {
        borderRadius: 2,
      }
    },
    edges: {
      color: "#ffffff"
    },
    height: "100%"
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };

  return (
    <div className={styles.patches}>
      <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={network => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
    </div>
  )
}