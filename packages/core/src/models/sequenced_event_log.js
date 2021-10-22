export class SequencedEventLogModel {

  constructor() {
    this.reset();
  }

  reset() {
    this.events = [];
    this.byMBS = {};
    this.last = null;

    return this;
  }

  eventsFor(m = 0, b = 0, s = 0) {
    const by = this.byMBS = this.byMBS || {};

    const byM = by[m] = by[m] || {};
    const byMB = byM[b] = byM[b] || {};
    const byMBS = byMB[s] = byMB[s] || [];

    return byMBS;
  }

  push(event) {
    this.events.push(event);

    this.eventsFor(
      event.at.measure,
      event.at.beat,
      event.at.subdivision
    ).push(event);

    if (!this.last || event.at.compare(this.last.at) === 1) {
      this.last = event;
    }

    return event;
  }
}