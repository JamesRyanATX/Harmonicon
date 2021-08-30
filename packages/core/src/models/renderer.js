import { BaseModel } from './base.js';
import { PositionModel } from './position.js';
import { SequencedEventModel } from './sequenced_event.js';
import { mapSeries } from '@composer/util';

export class RendererModel extends BaseModel {
  static drivers = {};

  static properties = {
    session: {},
    driver: {},
  }

  static register (name, driver) {
    this.drivers[name] = driver;
  }

  async render () {
    this.session.infer();

    await this.reset();
    await this.renderSession(this.session);
    await this.goToBeginning();

    return this;
  }

  async renderSession (session) {
    this.driver.session = session;

    this.logger.debug(`render.session: [+] name = ${this.session.name}`);
    this.logger.debug(`render.session:     number of events = ${this.session.events.length}`);
    this.logger.debug(`render.session:     number of phrases = ${this.session.phrases.length}`);
    this.logger.debug(`render.session:     number of instruments = ${this.session.instruments.length}`);
    this.logger.debug(`render.session:     number of tracks = ${this.session.tracks.length}`);
    this.logger.debug(`render.session:     number of patches = ${this.session.patches.length}`);

    await this.renderSessionEvents();
    await this.renderInstruments();
    await this.renderEffects();
    await this.renderPhrases();
    await this.renderTracks();
    await this.renderPatches();
    await this.renderEnd();

    return;
  }

  async renderSessionEvents () {
    return this.session.events.mapSeries(this.renderSessionEvent.bind(this));
  }

  async renderSessionEvent (event) {
    this.logger.debug(`render.session.event: [+] at = ${event.at}`);
    this.logger.debug(`render.session.event:     type = ${event.type}`);
    this.logger.debug(`render.session.event:     value = ${event.value}`);

    return this.driver.scheduleEvent({ event });
  }

  async renderInstruments () {
    return this.session.instruments.mapSeries(this.renderInstrument.bind(this));
  }

  async renderInstrument (instrument) {
    const node = this.driver.nodes.instrument[instrument.name] = this.driver.createNode({
      name: `instrument:${instrument.name}`,
      node: await instrument.fn({})
    });

    this.logger.info(`render.instrument: [+] name = ${instrument.name}`);
    this.logger.debug(`render.instrument:     fn = ${typeof instrument.fn}`);
    this.logger.debug(`render.instrument:     rendered = ${node.node}`);
    this.logger.debug(`render.instrument:     loaded = ${node.loaded}`);

    if (node.loaded) {
      return;
    }

    // Audio node may need time to load samples and external objects
    return new Promise((accept, reject) => {
      const interval = setInterval(() => {
        this.logger.debug(`render.instrument:     loaded = ${node.loaded}`);

        if (node.loaded) {
          clearInterval(interval);
          accept();
        }
      }, 500);
    });
  }

  async renderEffects () {
    return this.session.effects.mapSeries(this.renderEffect.bind(this));
  }

  async renderEffect (effect) {
    const rendered = await effect.fn();
    
    // Create an audio node
    this.driver.nodes.effect[effect.name] = this.createNode({
      name: `effect:${effect.name}`,
      node: rendered
    }),

    this.logger.info(`render.effect: [+] name = ${effect.name}`);
    this.logger.debug(`render.effect:     fn = ${typeof effect.fn}`);
    this.logger.debug(`render.effect:     rendered = ${rendered}`);
  }

  async renderPhrases() {
    return this.session.phrases.mapSeries(this.renderPhrase.bind(this));
  }

  async renderPhrase (phrase) {
    this.logger.info(`render.session.phrase: [+] name = ${phrase.name}`);
    this.logger.debug(`render.session.phrase:     number of steps = ${phrase.steps.length}`);

    this.driver.phrases[phrase.name] = phrase;
  }

  async renderTracks () {
    return this.session.tracks.mapSeries(this.renderTrack.bind(this));
  }

  async renderTrack (track) {
    const inputs = track.getSequenceableInputs();

    // Create an audio node for this track
    this.driver.nodes.track[track.name] = this.driver.createNode({
      name: `track:${track.name}`,
    }),

    this.logger.info(`render.session.track: [+] name = ${track.name}`);
    this.logger.debug(`render.session.track:     number of events = ${track.events.length}`);
    this.logger.debug(`render.session.track:     number of inputs = ${track.inputs.length}`);

    if (inputs.length === 0) {
      this.logger.error(`render.session.track:     no input nodes; is a patch missing?`);
      return;
    }

    return mapSeries(inputs, async (input, i) => {
      const node = this.driver.getNode(input.inputType, input.input).node;

      this.logger.debug(`render.session.track:     input ${i} source = ${input.inputType}:${input.input} (${node})`);

      return await track.events.mapSeries(async (event) => {
        return this.renderTrackEvent({ event, track, instrument: node });
      });  
    });
  }

  async renderTrackEvent ({ event, track, instrument }) {
    this.logger.info(`render.session.track.event: [+] at = ${event.at}`);
    this.logger.debug(`render.session.track.event:     type = ${event.type}`);
    this.logger.debug(`render.session.track.event:     value = ${event.value}`);
    this.logger.debug(`render.session.track.event:     instrument = ${instrument}`);

    return this.driver.scheduleEvent({ event, track, instrument })
  }

  async renderPatches () {
    return this.session.patches.mapSeries(this.renderPatch.bind(this));
  }

  async renderPatch (patch) {
    const inputNode = this.driver.nodes[patch.inputType][patch.input];
    const outputNode = this.driver.nodes[patch.outputType][patch.output];

    this.logger.info(`render.session.patch: [+] path = ${patch.inputType}:${patch.input} -> ${patch.outputType}:${patch.output}`);
    this.logger[inputNode ? 'debug' : 'error'](`render.session.patch:     input node = ${inputNode}`);
    this.logger[outputNode ? 'debug' : 'error'](`render.session.patch:     output node = ${outputNode}`);

    if (inputNode && outputNode) {
      inputNode.connect(outputNode);
    }
  }

  async renderEnd() {
    const lastEvent = this.driver.sequencedEventLog.last;
    const sustainFor = 2;
    const stopAt = PositionModel.parse({
      measure: lastEvent ? Number(lastEvent.at.measure) + sustainFor : sustainFor,
      beat: 0,
      subdivision: 0
    });

    this.logger.info(`render.session.end: [+] at = ${stopAt.toMBS()}`);
    this.logger.debug(`render.session.end:     last event = ${lastEvent ? lastEvent.at : 'unknown'}`)
    this.logger.debug(`render.session.end:     sustain for = ${sustainFor} measures`);

    return this.driver.scheduleEvent({
      log: false,
      event: new SequencedEventModel({
        value: true,
        type: 'end',
        at: stopAt
      }),
    });
  }

  get position () {
    return this.driver.position;
  }

  async reset () {
    return this.driver.reset();
  }

  play (options) {
    options = Object.assign({
      at: '0:0:0',
      markTime: false,
      markTimeInterval: 0.5
    }, options);

    this.driver.setTransportPosition(options.at);

    if (options.markTime) {
      this.driver.markTime({ interval: options.markTimeInterval });
    }

    return this.driver.play();
  }

  pause () {
    return this.driver.pause();
  }

  goToBeginning () {
    return this.driver.setTransportPosition('0:0:0');
  }

  goBackwardsByMeasure () {
    const {
      measure,
      beat,
      subdivision
    } = this.driver.position;

    if (beat === 0 && subdivision === 0) {
      return this.driver.setTransportPosition(`${measure - 1}:0:0`)
    }
    else if (measure > 0) {
      return this.driver.setTransportPosition(`${measure}:0:0`)
    }
  }

}

RendererModel.init();