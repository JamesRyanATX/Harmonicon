import { RendererBaseModel } from './base';
import { measure } from '@composer/util';

export class InteractiveRendererModel extends RendererBaseModel {

  get driverRenderer () {
    return this._driverRenderer = this._driverRenderer || this.driver.createInteractiveRenderer({
      renderer: this,
      session: this.session
    });
  }

}

// Initialize model properties
InteractiveRendererModel.init();

// Add metric observers
[
  'renderSessionEvents',
  'renderEffects',
  'renderInstruments',
  'renderPhrases',
  'renderTracks',
  'renderPatches',
  'renderEnd',
  'render',
  'reset',
].forEach((fn) => {
  measure(InteractiveRendererModel.prototype, fn, {
    label: `#${fn}()`
  });
});

