import { AudioDriver, RendererError } from '@composer/core';
import * as Tone from 'tone';

export class AudioNode extends AudioDriver.AudioNode {

  static factories = {
    track: (properties) => {
      return new Tone.Channel({ channelCount: 2, solo: false, mute: false });
    },
    meter: (properties) => {
      return new Tone.Meter({ channels: 2 });
    }
  }

  get loaded() {
    return this.node.loaded !== false;
  }

  static createNode(properties) {
    const factory = this.factories[properties.type];

    if (!factory) {
      throw new RendererError(`Missing node factory for type "${properties.type}"`);
    }

    return factory(properties);
  }

  static parse(properties) {

    // Create a Channel if a node was not provided
    if (!properties.node) {
      properties.node = this.createNode(properties);
    }

    // Connect root node to direct output
    if (properties.root) {
      properties.node.toDestination();
    }

    return new this(properties);
  }

  getValue() {
    return this.node.getValue();
  }

  connect(to) {
    this.node.connect(to.node);
  }
};

AudioNode.init();
