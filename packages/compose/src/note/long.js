import {
  DoubleDottedLongUnit,
  DottedLongUnit,
  LongUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Long note value.
 * 
 * @category Notes
 * @sort 1
 * @extends NoteComposer
 */
export class long extends NoteComposer {
  static unit = LongUnit;
}

export class dottedLong extends NoteComposer {
  static unit = DottedLongUnit;
}

export class doubleDottedLong extends NoteComposer {
  static unit = DoubleDottedLongUnit;
}


