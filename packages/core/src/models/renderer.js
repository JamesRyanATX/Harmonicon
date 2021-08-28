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
    const driver = this.driver;

    this.session.infer();

    await driver.reset();
    await driver.render(this.session);
    await driver.setTransportPosition('0:0:0');

    return this;
  }

  get position () {
    return this.driver.position;
  }

  play (options) {
    options = Object.assign({
      at: '0:0:0',
      markTime: false,
      markTimeInterval: 0.5
    }, options);

    this.driver.setTransportPosition(options.at);

    if (options.markTime) {
      this.driver.markTime({ interval: options.markTimeInterval });
    }

    return this.driver.play();
  }

  pause () {
    return this.driver.pause();
  }

  goToBeginning () {
    return this.driver.setTransportPosition('0:0:0');
  }

  goBackwardsByMeasure () {
    const {
      measure,
      beat,
      subdivision
    } = this.driver.position;

    if (beat === 0 && subdivision === 0) {
      return this.driver.setTransportPosition(`${measure - 1}:0:0`)
    }
    else if (measure > 0) {
      return this.driver.setTransportPosition(`${measure}:0:0`)
    }
  }

}

RendererModel.init();