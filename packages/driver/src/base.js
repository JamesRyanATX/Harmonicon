import { Logger } from '@composer/util';

export class BaseDriver {

  get name () {
    return this.constructor.name;
  }

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  async render(session) {
    this.session = session;

    await this.renderSession();
    await this.renderSessionEvents();
    await this.renderInstruments();
    await this.renderPhrases();
    await this.renderTracks();
  }

  async renderSession () {
    this.logger.debug(`render.session: [+] name = ${this.session.name}`);
    this.logger.debug(`render.session:     number of events = ${this.session.events.length}`);
    this.logger.debug(`render.session:     number of phrases = ${this.session.phrases.length}`);
    this.logger.debug(`render.session:     number of instruments = ${this.session.instruments.length}`);
    this.logger.debug(`render.session:     number of tracks = ${this.session.tracks.length}`);
    this.logger.debug(`render.session:     number of routes = ${this.session.routes.length}`);
  }

  async renderSessionEvents () {
    return this.session.events.mapSeries(this.renderSessionEvent.bind(this));
  }

  async renderSessionEvent (event) {
    this.logger.debug(`render.session.event: [+] at = ${event.at}`);
    this.logger.debug(`render.session.event:     type = ${event.type}`);
    this.logger.debug(`render.session.event:     value = ${event.value}`);
  }

  async renderPhrases() {
    return this.session.phrases.mapSeries(this.renderPhrase.bind(this));
  }

  async renderPhrase (phrase) {
    this.logger.debug(`render.session.phrase: [+] name = ${phrase.name}`);
    this.logger.debug(`render.session.phrase:     number of steps = ${phrase.steps.length}`);

    this.phrases[phrase.name] = phrase;
  }

  async renderInstruments () {
    return this.session.instruments.mapSeries(this.renderInstrument.bind(this));
  }

  async renderInstrument (instrument) {
    const rendered = await instrument.fn();
    this.instruments[instrument.name] = rendered;

    this.logger.debug(`render.instrument: [+] name = ${instrument.name}`);
    this.logger.debug(`render.instrument:     fn = ${typeof instrument.fn}`);
    this.logger.debug(`render.instrument:     rendered = ${rendered}`);
  }

  async renderTracks () {
    return this.session.tracks.mapParallel(this.renderTrack.bind(this));
  }

  async renderTrack (track) {
    const instrumentName = track.name;
    const instrument = this.instruments[instrumentName];

    this.logger.debug(`render.session.track: [+] name = ${track.name}`);
    this.logger.debug(`render.session.track:     number of events = ${track.events.length}`);
    this.logger.debug(`render.session.track:     instrument = ${instrumentName}`);

    return track.events.mapSeries((event) => {
      return this.renderTrackEvent({ event, track, instrument });
    });
  }

  async renderTrackEvent ({ event, track, instrument }) {
    this.logger.debug(`render.session.track.event: [+] at = ${event.at}`);
    this.logger.debug(`render.session.track.event:     type = ${event.type}`);
    this.logger.debug(`render.session.track.event:     value = ${event.value}`);

    return this.scheduleTrackEvent({ event, track, instrument })
  }

  async reset() {
    this.instruments = {};
    this.tracks = {};
    this.phrases = {};

    this.resetAudioBuffer();
  }

  async start() {
    return this.startAudioBuffer();
  }

  
  // == override in driver subclasses

  async markTime() {
    this.logger.error('markTime() not implemented');
  }

  async scheduleTrackEvent({ event, track, instrument }) {
    this.logger.error('scheduleTrackEvent() not implemented');
  }

  async scheduleSessionEvent({ event, session }) {
    this.logger.error('scheduleSessionEvent() not implemented');
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