import { BaseDriver } from './base';

export class BaseAudioDriver extends BaseDriver {

  async render(session) {
    this.session = session;

    await this.renderSession();
    await this.renderSessionEvents();
    await this.renderInstruments();
    await this.renderPhrases();
    await this.renderTracks();
    await this.renderPatches();
  }

  async renderSession () {
    this.logger.debug(`render.session: [+] name = ${this.session.name}`);
    this.logger.debug(`render.session:     number of events = ${this.session.events.length}`);
    this.logger.debug(`render.session:     number of phrases = ${this.session.phrases.length}`);
    this.logger.debug(`render.session:     number of instruments = ${this.session.instruments.length}`);
    this.logger.debug(`render.session:     number of tracks = ${this.session.tracks.length}`);
    this.logger.debug(`render.session:     number of patches = ${this.session.patches.length}`);
  }

  async renderSessionEvents () {
    return this.session.events.mapSeries(this.renderSessionEvent.bind(this));
  }

  async renderSessionEvent (event) {
    this.logger.debug(`render.session.event: [+] at = ${event.at}`);
    this.logger.debug(`render.session.event:     type = ${event.type}`);
    this.logger.debug(`render.session.event:     value = ${event.value}`);

    return this.scheduleEvent({ event });
  }

  async renderPhrases() {
    return this.session.phrases.mapSeries(this.renderPhrase.bind(this));
  }

  async renderPhrase (phrase) {
    this.logger.info(`render.session.phrase: [+] name = ${phrase.name}`);
    this.logger.debug(`render.session.phrase:     number of steps = ${phrase.steps.length}`);

    this.phrases[phrase.name] = phrase;
  }

  async renderInstruments () {
    return this.session.instruments.mapSeries(this.renderInstrument.bind(this));
  }

  async renderInstrument (instrument) {
    const rendered = await instrument.fn();
    
    // Create an audio node
    this.nodes.instrument[instrument.name] = this.createNode({
      name: `instrument:${instrument.name}`,
      node: rendered
    }),

    this.logger.info(`render.instrument: [+] name = ${instrument.name}`);
    this.logger.debug(`render.instrument:     fn = ${typeof instrument.fn}`);
    this.logger.debug(`render.instrument:     rendered = ${rendered}`);
  }

  async renderTracks () {
    return this.session.tracks.mapSeries(this.renderTrack.bind(this));
  }

  async renderTrack (track) {
    const instrument = track.instrument;

    // Create an audio node
    this.nodes.track[track.name] = this.createNode({
      name: `track:${track.name}`,
    }),

    this.logger.info(`render.session.track: [+] name = ${track.name}`);
    this.logger.debug(`render.session.track:     number of events = ${track.events.length}`);

    if (!instrument) {
      this.logger.error(`render.session.track:     instrument = none; patch missing?`);
      return;
    }

    const instrumentName = instrument.name;
    const node = this.nodes.instrument[instrumentName].node;

    this.logger.debug(`render.session.track:     instrument name = ${instrument.name}`);
    this.logger.debug(`render.session.track:     node = ${node}`);
  
    return await track.events.mapSeries(async (event) => {
      return this.renderTrackEvent({ event, track, instrument: node });
    });  
  }

  async renderPatches () {
    return this.session.patches.mapSeries(this.renderPatch.bind(this));
  }

  async renderPatch (patch) {
    const inputNode = this.nodes[patch.inputType][patch.input];
    const outputNode = this.nodes[patch.outputType][patch.output];

    this.logger.info(`render.session.patch: [+] path = ${patch.inputType}:${patch.input} -> ${patch.outputType}:${patch.output}`);
    this.logger[inputNode ? 'debug' : 'error'](`render.session.patch:     input node = ${inputNode}`);
    this.logger[outputNode ? 'debug' : 'error'](`render.session.patch:     output node = ${outputNode}`);

    if (inputNode && outputNode) {
      inputNode.connect(outputNode);
    }
  }


  async renderTrackEvent ({ event, track, instrument }) {
    this.logger.info(`render.session.track.event: [+] at = ${event.at}`);
    this.logger.debug(`render.session.track.event:     type = ${event.type}`);
    this.logger.debug(`render.session.track.event:     value = ${event.value}`);
    this.logger.debug(`render.session.track.event:     instrument = ${instrument}`);

    return this.scheduleEvent({ event, track, instrument })
  }

  async reset() {
    this.nodes = {
      instrument: {},
      track: {
        main: this.createNode({ name: 'track:main', root: true }),
      },
      effect: {},
    };

    this.tracks = {};
    this.phrases = {};

    await this.unscheduleAll();
    await this.resetAudioBuffer();
    await this.setTransportPosition('0:0:0');
  }

  async start() {
    return this.startAudioBuffer();
  }

  async scheduleEvent({ event }) {
    const scheduler = this.schedulers[event.type];

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