import {
  DoubleDottedLargeUnit,
  DottedLargeUnit,
  LargeUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Large note value.
 * 
 * @category Notes
 * @sort 0
 * @extends NoteComposer
 */
export class large extends NoteComposer {
  static unit = LargeUnit;
}

export class dottedLarge extends NoteComposer {
  static unit = DottedLargeUnit;
}

export class doubleDottedLarge extends NoteComposer {
  static unit = DoubleDottedLargeUnit;
}


