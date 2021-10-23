import { AudioDriver } from '../../../';

class AudioNode extends AudioDriver.AudioNode {
}

class Renderer extends AudioDriver.Renderer {

  schedulers = {
    end: () => {}
  }

  createNode(properties = {}) {
    return AudioNode.parse(properties);
  }

  setPosition() {}
  unscheduleAll() {}
}

class InteractiveRenderer extends Renderer {
}

class BackgroundRenderer extends Renderer {
}

export class Driver extends AudioDriver.Driver {

  createInteractiveRenderer ({ session, renderer }) {
    return new InteractiveRenderer({
      driver: this, session, renderer
    });
  }

  createBackgroundRenderer ({ session, renderer }) {
    return new BackgroundRenderer({
      driver: this, session, renderer
    });
  }

  on() {}

}