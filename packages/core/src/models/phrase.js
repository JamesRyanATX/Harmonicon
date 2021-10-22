import { BaseModel } from './base.js';
import { ExpressionModel } from './expression';

export class PhraseModel extends BaseModel {

  static properties = {
    steps: {},
    compiledSteps: {},
    session: {},
    name: {},
  }

  compile() {
    this.compiledSteps = this.steps.reduce((steps, step) => {
      if (step instanceof ExpressionModel) {
        return steps.concat(step.compile());
      }
      else {
        steps.push(step);
      }
      return steps;
    }, []);

    return this;
  }

}

PhraseModel.init();