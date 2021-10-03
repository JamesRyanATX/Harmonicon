import { RendererBaseModel } from './base';

export class InteractiveRendererModel extends RendererBaseModel {

  get driverRenderer () {
    return this._driverRenderer = this._driverRenderer || this.driver.createInteractiveRenderer({
      renderer: this,
      session: this.session
    });
  }

  observePosition(fn) {
    return this.driverRenderer.observePosition(fn);
  }

  play (options) {
    options = Object.assign({
      at: '0:0:0',
      markTime: false,
      markTimeInterval: 0.5
    }, options);

    this.driverRenderer.setTransportPosition(options.at);

    if (options.markTime) {
      this.markTime({ interval: options.markTimeInterval });
    }

    return this.driverRenderer.play();
  }

  pause () {
    return this.driverRenderer.pause();
  }

  stop () {
    return this.driverRenderer.stop();
  }

}

InteractiveRendererModel.init();