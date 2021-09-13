import {
  DoubleDottedEighthUnit,
  DottedEighthUnit,
  EighthUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Eighth note value.
 * 
 * @sort 6
 * @category Notes
 * @extends NoteComposer
 */
export class eighth extends NoteComposer {
  static unit = EighthUnit;
}

export class dottedEighth extends NoteComposer {
  static unit = DottedEighthUnit;
}

export class doubleDottedEighth extends NoteComposer {
  static unit = DoubleDottedEighthUnit;
}


