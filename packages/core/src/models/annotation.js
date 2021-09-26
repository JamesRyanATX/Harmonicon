import { BaseModel } from './base.js';

export class AnnotationModel extends BaseModel {
  static properties = {
    position: {},
    name: {},
    session: {},
  }
}

AnnotationModel.init();