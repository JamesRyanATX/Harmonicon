const dictionary = {};

class ExpandedError extends Error {

  // Create a new error subclass
  static extend({
    name = null,
    code = null,
  }) {
    return dictionary[code] = class extends this {
      static code = code;
      static name = name;
    }
  }

  static async rescue(fn, withFn) {
    try {
      return fn();
    }
    catch (e) {
      if (e instanceof this) {
        withFn(e);
      }
    }
  }

  get name () { return this.contructor.name };
  get code () { return this.contructor.code };

  constructor(message) {
    super(message);
  }

}

export const createErrorType = ExpandedError.extend.bind(ExpandedError);