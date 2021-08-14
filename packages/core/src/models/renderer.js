import { BaseModel } from './base';

export class RendererModel extends BaseModel {
  static drivers = {};

  static properties = {
    session: {},
    driver: {},
  }

  static register (name, driver) {
    this.drivers[name] = driver;
  }

  async render () {
    await this.driver.reset();
    await this.driver.render(this.session);

    return this;
  }

  play (options) {
    options = Object.assign({
      at: '0:0:0',
      markTime: true,
      markTimeInterval: 0.5
    }, options);

    this.driver.setTransportPosition(options.at);

    if (options.markTime) {
      this.driver.markTime({ interval: options.markTimeInterval });
    }

    return this.driver.play();
  }
}

RendererModel.init();