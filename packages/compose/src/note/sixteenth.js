import {
  DoubleDottedSixteenthUnit,
  DottedSixteenthUnit,
  SixteenthUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Sixteenth note value.
 * 
 * @sort 7
 * @category Notes
 * @extends NoteComposer
 */
export class sixteenth extends NoteComposer {
  static unit = SixteenthUnit;
}

export class dottedSixteenth extends NoteComposer {
  static unit = DottedSixteenthUnit;
}

export class doubleDottedSixteenth extends NoteComposer {
  static unit = DoubleDottedSixteenthUnit;
}


