import {
  DoubleDottedEighthUnit,
  DottedEighthUnit,
  EighthUnit,
  TripletEighthUnit,
  QuintupletEighthUnit,
  SeptupletEighthUnit,
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

export class tripletEighth extends NoteComposer {
  static unit = TripletEighthUnit;
}

export class quintupletEighth extends NoteComposer {
  static unit = QuintupletEighthUnit;
}

export class septupletEighth extends NoteComposer {
  static unit = SeptupletEighthUnit;
}
