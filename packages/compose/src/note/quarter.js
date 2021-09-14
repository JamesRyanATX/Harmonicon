import {
  DoubleDottedQuarterUnit,
  DottedQuarterUnit,
  QuarterUnit,
  TripletQuarterUnit,
  QuintupletQuarterUnit,
  SeptupletQuarterUnit

} from "@composer/core";

import { NoteComposer } from "../note";

/**
 * Quarter note value.
 * 
 * @sort 5
 * @category Notes
 * @extends NoteComposer
 * @hideconstructor
 */
export class quarter extends NoteComposer {
  static unit = QuarterUnit;
}

export class dottedQuarter extends NoteComposer {
  static unit = DottedQuarterUnit;
}

export class doubleDottedQuarter extends NoteComposer {
  static unit = DoubleDottedQuarterUnit;
}

export class tripletQuarter extends NoteComposer {
  static unit = TripletQuarterUnit;
}

export class quintupletQuarter extends NoteComposer {
  static unit = QuintupletQuarterUnit;
}

export class septupletQuarter extends NoteComposer {
  static unit = SeptupletQuarterUnit;
}

