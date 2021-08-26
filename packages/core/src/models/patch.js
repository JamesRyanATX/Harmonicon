import { BaseModel } from './base';

export class PatchModel extends BaseModel {

  static properties = {
    session: {
      json: false,
    },
    inputType: {
      type: String,
    },
    input: {
      type: String,
    },
    outputType: {
      type: String,
    },
    output: {
      type: String,
    },
  }

  validate () {
    const errors = [];

    // Prevent routing instruments directly to main
    if (
      this.inputType === 'instrument' &&
      this.outputType === 'track' &&
      this.output === 'main'
    ) {
      errors.push({
        message: 'Instruments cannot be sent directly to the main output.',
        code: 'invalid_patch'
      })
    }

    return { errors, valid: errors.length === 0 };
  }

}

PatchModel.init();