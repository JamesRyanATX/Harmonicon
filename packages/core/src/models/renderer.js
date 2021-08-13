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
}

RendererModel.init();