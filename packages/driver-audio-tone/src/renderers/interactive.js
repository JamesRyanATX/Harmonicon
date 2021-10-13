import { BaseRenderer } from './base';

export class InteractiveRenderer extends BaseRenderer {
  get loggerName() { return 'InteractiveRenderer' };

  get interactive() { return true; }

  get transport() {
    return Tone.Transport;
  }

}
