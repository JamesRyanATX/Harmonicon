import { mapSeries } from '@composer/util';
import { BaseModel } from '../base.js';
import { PositionModel } from '../position.js';
import { SequencedEventModel } from '../sequenced_event.js';
import { SequencedEventLogModel } from '../sequenced_event_log.js';
import { RendererError } from '../../errors';
import { config } from '../../config';


export class RendererBaseModel extends BaseModel {

  static properties = {
    session: {},
  }

  // Realtime position of transport
  get position () {
    return this.driverRenderer.position;
  }

  get state () {
    return this.driverRenderer.state;
  }

  get driver () {
    return config.drivers.audio;
  }

  get driverRenderer() {
    throw new RendererError(`${this.constructor.name} does not implement driverRenderer.`);
  }


  // Renderers
  // ---------

  async render (options = {}) {
    if (!this.driver || !this.driverRenderer) {
      throw new RendererError('No available audio driver.')
    }

    return new Promise(async (accept, reject) => {
      try {
        await this.reset();
        await this.renderSession(options).catch(reject);
        await this.driverRenderer.setPosition(PositionModel.parse(0));

        accept(this);
      }
      catch (e) {
        this.logger.error(e);
        reject(new RendererError(`Unable to render session.`));
      }
    });
  }

  async renderSession ({
    instruments = true,
    tracks = true,
    effects = true,
    sessionEvents = true,
    phrases = true,
    patches = true,
    end = true,
  } = {}) {
    await Promise.all([
      sessionEvents ? this.renderSessionEvents() : true,
      instruments ? this.renderInstruments() : true,
      effects ? this.renderEffects() : true,
      phrases ? this.renderPhrases() : true,        
    ])
      
    tracks ? await this.renderTracks() : true;

    await Promise.all([
      patches ? this.renderPatches() : true,
      end ? this.renderEnd() : true,
    ]);
  }

  async renderSessionEvents () {
    return this.session.events.mapParallel(this.renderSessionEvent.bind(this));
  }

  async renderSessionEvent (event) {
    // this.logger.debug(`render.session.event: [+] at = ${event.at}`);
    // this.logger.debug(`render.session.event:     type = ${event.type}`);
    // this.logger.debug(`render.session.event:     value = ${event.value}`);

    return this.scheduleEvent({ event });
  }

  async renderInstruments () {
    return this.session.instruments.mapParallel(this.renderInstrument.bind(this));
  }

  async renderInstrument (instrument) {
    return this.createNode({
      type: 'instrument',
      name: instrument.name, 
      node: await instrument.render(),
      model: instrument,
    });
  }

  async renderEffects () {
    return this.session.effects.mapParallel(this.renderEffect.bind(this));
  }

  async renderEffect (effect) {    
    return this.createNode({
      type: 'effect',
      name: effect.name,
      node: await effect.render(),
      model: effect,
    });
  }

  async renderPhrases() {
    return this.session.phrases.mapSeries(this.renderPhrase.bind(this));
  }

  async renderPhrase (phrase) {
    this.cache.phrases[phrase.name] = phrase.compile();
  }

  async renderTracks () {

    // Create a root main output track
    const mainNode = this.createNode({
      type: 'track',
      name: 'main',
      root: true,
    });

    // Create a root main output track
    const mainMeterNode = this.createNode({
      type: 'meter',
      name: 'main',
    });

    mainNode.connect(mainMeterNode);

    return this.session.tracks.mapSeries(this.renderTrack.bind(this));
  }

  async renderTrack (track) {
    const inputs = track.getSequenceableInputs();

    // Create an audio node for this track
    const trackNode = await this.createNode({
      type: 'track',
      name: track.name,
      model: track,
    });

    if (inputs.length === 0) {
      this.logger.error(`#renderTrack(): no input nodes for ${track.name}; is a patch missing?`);
      return;
    }

    return mapSeries(inputs, async (input, i) => {
      const instrumentNode = this.getNode(input.inputType, input.input);

      return await track.events.mapSeries(async (event) => {
        return this.renderTrackEvent({
          event,
          track,
          trackNode,
          instrumentNode
        });
      });  
    });
  }

  async renderTrackEvent ({
    event,
    track,
    trackNode,
    instrumentNode
  }) {
    return this.scheduleEvent({
      audioNode: trackNode,
      event,
      track,
      trackNode,
      instrumentNode
    });
  }

  async renderPatches () {
    return this.session.patches.mapSeries(this.renderPatch.bind(this));
  }

  async renderPatch (patch) {
    const inputNode = this.getNode(patch.inputType, patch.input);
    const outputNode = this.getNode(patch.outputType, patch.output);

    if (inputNode && outputNode) {
      try {
        inputNode.connect(outputNode);
      }
      catch (e) {
        console.error(e);
        throw new RendererError(`Unable to patch ${inputNode} to ${outputNode}`);
      }
    }
  }

  async renderEnd() {
    const lastEvent = this.cache.events.last;
    const sustainFor = 2;
    const stopAt = this.stopAt = PositionModel.parse({
      measure: lastEvent ? Number(lastEvent.at.measure) + sustainFor : sustainFor,
      beat: 0,
      subdivision: 0
    });

    return this.scheduleEvent({
      log: false,
      event: new SequencedEventModel({
        value: true,
        type: 'end',
        at: stopAt
      }),
    });
  }


  // Events
  // ------

  async scheduleEvent({
    event,
    instrument = null,
    instrumentNode = null,
    track = null,
    trackNode,
    meta = {},
    log = true
  }) {

    if (track) {
      meta.track = track;
    }

    // Find driver scheduler for this event
    const scheduler = this.driverRenderer.schedulers[event.type];

    // Add to global event log
    if (log) {
      this.cache.events.push(event, meta);
    }

    if (scheduler) {
      return await scheduler.apply(this, arguments);
    }
    else {
      this.logger.error(`missing scheduler for type "${event.type}"`);
    }
  }

  async unscheduleAll() {
    return this.driverRenderer ? this.driverRenderer.unscheduleAll() : this;
  }


  // Audio nodes
  // -----------

  createNode(properties = {}) {
    const { name, type } = properties;

    this.cache.nodes = this.cache.nodes || {};
    this.cache.nodes[type] = this.cache.nodes[type] || {};

    return this.cache.nodes[type][name] = this.driverRenderer.createNode(Object.assign(properties, {
      name: `${type}:${name}`,
    }));
  }

  getNode(type, name) {
    this.cache.nodes = this.cache.nodes || {};
    this.cache.nodes[type] = this.cache.nodes[type] || {};

    return this.cache.nodes[type][name];
  }


  // Cache
  // -----

  resetCache () {
    this.cache = {
      nodes: {},
      tracks: {},
      phrases: {},
      events: new SequencedEventLogModel()
    };
  }


  // Misc
  // ----

  async reset () {
    this.resetCache();
    return this.unscheduleAll();
  }

  delegate(method, ...args) {
    this.logger.debug(`#delegate() => ${method}()`);

    if (this.driverRenderer) {
      return this.driverRenderer[method].apply(this.driverRenderer, args);
    }
  }
}
