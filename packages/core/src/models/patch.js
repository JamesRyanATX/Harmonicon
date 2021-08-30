import { BaseModel } from './base.js';

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

  // Whether or not the input associated with this patch can be sequnced
  get sequenceable () {
    return this.inputType === 'instrument';
  }

  // Get direct parents
  get parents () {
    return this.session.patches.reduce((parents, patch) => {
      if (patch.outputType === this.inputType && patch.output === this.input) {
        parents.push(patch);
      }

      return parents;
    }, []);
  }

  // Get all ancestors recursively
  get ancestors () {
    return this.parents.reduce((parents, patch) => {
      return parents.concat([ patch ]).concat(patch.parents);
    }, []);
  }

  // Traverse ancestors and return all sequenceables
  get sequenceableAncestors () {
    return this.ancestors.filter((patch) => {
      return patch.sequenceable;
    })
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