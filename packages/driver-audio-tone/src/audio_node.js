import { AudioDriver } from '@composer/core';
import * as Tone from 'tone';

export class AudioNode extends AudioDriver.AudioNode {

  get loaded() {
    return this.node.loaded !== false;
  }

  static parse(properties) {

    // Create a Channel if a node was not provided
    if (!properties.node) {
      properties.node = new Tone.Channel({ channelCount: 2, solo: false, mute: false });
    }

    // Connect root node to direct output
    if (properties.root) {
      properties.node.toDestination();
    }

    return new this(properties);
  }

  connect(to) {
    this.node.connect(to.node);
  }
};

AudioNode.init();
