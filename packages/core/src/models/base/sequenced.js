import { BaseModel } from '../base';

export class BaseSequencedModel extends BaseModel {

  getLastEventByTypeAndPosition(type, position) {
    return this.events.all
      .filter((event) => {
        return (
          event.type === type &&
          event.at.measure <= position.measure &&
          event.at.beat <= position.beat &&
          event.at.subdivision <= position.subdivision
        );
      })
      .sort((a, b) => {
        return (
          a.measure < b.measure &&
          a.beat < b.beat &&
          a.subdivision < b.subdivision
        ) ? -1 : 1
      })[0];
  }

}