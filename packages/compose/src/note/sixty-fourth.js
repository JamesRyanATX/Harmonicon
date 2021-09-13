import {
  DoubleDottedSixtyFourthUnit,
  DottedSixtyFourthUnit,
  SixtyFourthUnit,
} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Sixty-fourth note value.
 * 
 * @sort 9
 * @category Notes
 * @extends NoteComposer
 */
export class sixtyFourth extends NoteComposer {
  static unit = SixtyFourthUnit;
}

export class dottedSixtyFourth extends NoteComposer {
  static unit = DottedSixtyFourthUnit;
}

export class doubleDottedSixtyFourth extends NoteComposer {
  static unit = DoubleDottedSixtyFourthUnit;
}


