import {
  DoubleDottedSixteenthUnit,
  DottedSixteenthUnit,
  SixteenthUnit,
  TripletSixteenthUnit,
  QuintupletSixteenthUnit,
  SeptupletSixteenthUnit,
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

export class tripletSixteenth extends NoteComposer {
  static unit = TripletSixteenthUnit;
}

export class quintupletSixteenth extends NoteComposer {
  static unit = QuintupletSixteenthUnit;
}

export class septupletSixteenth extends NoteComposer {
  static unit = SeptupletSixteenthUnit;
}
