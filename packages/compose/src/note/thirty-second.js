import {
  DoubleDottedThirtySecondUnit,
  DottedThirtySecondUnit,
  ThirtySecondUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Thirty-second note value.
 * 
 * @sort 8
 * @category Notes
 * @extends NoteComposer
 */
export class thirtySecond extends NoteComposer {
  static unit = ThirtySecondUnit;
}

export class dottedThirtySecond extends NoteComposer {
  static unit = DottedThirtySecondUnit;
}

export class doubleDottedThirtySecond extends NoteComposer {
  static unit = DoubleDottedThirtySecondUnit;
}


