import { RendererBaseModel } from './base';


export class InteractiveRendererModel extends RendererBaseModel {

  get driverRenderer () {
    return this._driverRenderer = this._driverRenderer || this.driver.createInteractiveRenderer({
      renderer: this,
      session: this.session
    });
  }

}

InteractiveRendererModel.init();