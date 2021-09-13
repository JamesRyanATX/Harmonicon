import {
  DoubleDottedDoubleWholeUnit,
  DottedDoubleWholeUnit,
  DoubleWholeUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Double-whole note value.
 * 
 * @sort 2
 * @category Notes
 * @extends NoteComposer
 */
export class doubleWhole extends NoteComposer {
  static unit = DoubleWholeUnit;
}

export class dottedDoubleWhole extends NoteComposer {
  static unit = DottedDoubleWholeUnit;
}

export class doubleDottedDoubleWhole extends NoteComposer {
  static unit = DoubleDottedDoubleWholeUnit;
}


