import {
  DoubleDottedWholeUnit,
  DottedWholeUnit,
  WholeUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Whole note value.
 * 
 * @category Notes
 * @sort 3
 * @extends NoteComposer
 */
export class whole extends NoteComposer {
  static unit = WholeUnit;
}

export class dottedWhole extends NoteComposer {
  static unit = DottedWholeUnit;
}

export class doubleDottedWhole extends NoteComposer {
  static unit = DoubleDottedWholeUnit;
}


