import { BaseDriver } from './base';

class SequencedEventLog {

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

  record(event) {
    this.events.push(event);

    this.eventsFor(
      event.at.measure,
      event.at.beat,
      event.at.subdivision
    ).push(event);

    if (
      !this.last || 
      (
        event.at.measure >= this.last.at.measure &&
        event.at.beat >= this.last.at.beat &&
        event.at.subdivision >= this.last.at.subdivision
      )
    ) {
      this.last = event;
    }

    return event;
  }
}

export class BaseAudioDriver extends BaseDriver {

  getNode(type, name) {
    return this.nodes[type][name];
  }

  async reset() {

    // Create or reset the global event log
    this.sequencedEventLog = (this.sequencedEventLog || new SequencedEventLog()).reset();

    // Recreate audio node structure
    this.nodes = {
      instrument: {},
      track: {
        main: this.createNode({ name: 'track:main', root: true }),
      },
      effect: {},
    };

    this.tracks = {}; // why?
    this.phrases = {}; // why?

    await this.unscheduleAll();
    await this.resetAudioBuffer();
    await this.setTransportPosition('0:0:0');
  }

  async start() {
    return this.startAudioBuffer();
  }

  async scheduleEvent({ event, log = true }) {

    // Find scheduler for this event
    const scheduler = this.schedulers[event.type];

    // Add to global event log
    if (log) {
      this.sequencedEventLog.record(event);
    }

    if (scheduler) {
      return await scheduler.apply(this, arguments);
    }
    else {
      this.logger.error(`missing scheduler for type "${event.type}"`);
    }
  }

  markTime({ interval }) {
    setInterval(() => {
      const {
        ticks,
        measure,
        beat,
        subdivision,
        realtime
      } = this.position;

      this.logger.info(`markTime: transport = ${measure}:${beat}:${subdivision} (${realtime}s, ${ticks}t)`);
    }, interval * 1000);
  }


  // Override in driver subclasses
  // =============================

  get state () {
    this.logger.error(`${this.name}.state not implemented`);
  }

  get position () {
    this.logger.error(`${this.name}.position not implemented`);
  }

  createNode() {
    this.logger.error('createNode() not implemented');
  }

  observePosition(fn) {
    this.logger.error('observePosition() not implemented');
  }

  // Events: start|stop|pause|loop
  async on() {
    this.logger.error('on() not implemented');
  }

  async unscheduleAll () {
    this.logger.error('unscheduleAll() not implemented');
  }

  async startAudioBuffer() {
    this.logger.error('startAudioBuffer() not implemented');
  }

  async stopAudioBuffer() {
    this.logger.error('stopAudioBuffer() not implemented');
  }

  async resetAudioBuffer() {
    this.logger.error('resetAudioBuffer() not implemented');
  }

  async setTransportPosition(position) {
    this.logger.error('setTransportPosition() not implemented');
  }

  async play() {
    this.logger.error('play() not implemented');
  }

  async pause() {
    this.logger.error('pause() not implemented');
  }

  async stop() {
    this.logger.error('stop() not implemented');
  }

  async loop(position) {
    this.logger.error('loop() not implemented');
  }

}