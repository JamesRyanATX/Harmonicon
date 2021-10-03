import { BaseRenderer } from './base';

export class InteractiveRenderer extends BaseRenderer {

  get interactive() { return true; }

  get transport() {
    return Tone.Transport;
  }

}
