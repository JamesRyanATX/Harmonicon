import {
  DoubleDottedHalfUnit,
  DottedHalfUnit,
  HalfUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Half note value.
 * 
 * @sort 4
 * @category Notes
 * @extends NoteComposer
 */
export class half extends NoteComposer {
  static unit = HalfUnit;
}

export class dottedHalf extends NoteComposer {
  static unit = DottedHalfUnit;
}

export class doubleDottedHalf extends NoteComposer {
  static unit = DoubleDottedHalfUnit;
}


