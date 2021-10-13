import audioEncoder from 'audio-encoder';
import { RendererError } from '../../errors';
import { RendererBaseModel } from './base';
import { measure } from '@composer/util';

export class BackgroundRendererModel extends RendererBaseModel {

  get driverRenderer () {
    return this._driverRenderer = this._driverRenderer || this.driver.createBackgroundRenderer({
      renderer: this,
      session: this.session
    });
  }

  /**
   * Render session as an audio buffer for processing.
   * 
   * @returns {AudioBuffer}
   */
  async render ({
    channels = 2,
    sampleRate = 44100,
    duration = null,
  } = {}) {
    this.logger.debug(`#render() channels = ${channels}; sampleRate = ${sampleRate}; duration = ${duration}`)

    if (!duration) {
      this.logger.error(`#render() nothing to render; duration is zero`)
      return this;
    }

    await this.reset();

    // Render session to an audio buffer
    this.buffer = await this.driverRenderer.renderToBuffer({ duration, channels, sampleRate },
      this.renderSession.bind(this));

    this.logger.debug(`#render() created buffer with channels = ${channels}; sampleRate = ${sampleRate} `);

    return this;
  }

  encode({
    format = 'wav',
    bitRate = 192,
    sampleRate = 44100,
    onProgress = () => {},
  }) {

    if (!this.buffer) {
      throw new RendererError('No audio buffer to encode');
    }

    if (this.buffer.sampleRate !== sampleRate) {
      throw new RendererError(`Expected sample rate of ${sampleRate}; got ${this.buffer.sampleRate}`);
    }

    this.logger.debug(`#encode() format = ${format}; bitRate = ${bitRate}; sampleRate = ${sampleRate}`);

    return new Promise((accept, reject) => {
      const onEncodeProgress = (pct) => {
        onProgress(pct);
      };

      const onEncodeComplete = (blob) => {
        accept(blob);
      };

      if (format === 'wav') {
        audioEncoder(this.buffer, 'WAV', onEncodeProgress, onEncodeComplete);
      }
      else {
        audioEncoder(this.buffer, bitRate, onEncodeProgress, onEncodeComplete);
      }
    });
  }

  toWav({ sampleRate, onProgress } = {}) {
    return this.encode({ format: 'wav', sampleRate, onProgress });
  }

  toMp3({ bitRate, onProgress } = {}) {
    return this.encode({ format: 'mp3', bitRate, onProgress })
  }

  /**
   * Generate raw waveform data
   * 
   * @param {object} properties 
   * @param {integer} properties.buckets - number of buckets to flatten into
   * @param {integer} properties.channel - channel to extract (null for mono)
   * @returns Array
   */
  toWaveform({
    channel = null,
    buckets = null,
  } = {}) {
    const data = (() => {
      if (channel) {
        return Array.from(this.buffer.getChannelData(channel));
      }
      else {
        const left = Array.from(this.buffer.getChannelData(0));
        const right = Array.from(this.buffer.getChannelData(1));
    
        return left.map((l, i) => {
          return l > right[i] ? l : right[i];
        });
      }
    })();
    
    const waveform = [];
    const bucketSize = Math.ceil(data.length / buckets);

    this.logger.debug(`#toWaveform() channel = ${channel}; size = ${data.length}; buckets = ${buckets}; bucketSize = ${bucketSize}`);

    if (!buckets) {
      return data;
    }

    let bucket = [];

    while (data.length > 0 && waveform.length < buckets) {
      while (data.length > 0 && bucket.length < bucketSize) {
        bucket.push(data.shift());
      }

      waveform.push(bucket.reduce((sum, value) => {
        return sum + value;
      }, 0) / bucket.length);

      bucket = [];
    }

    return waveform;
  }

}

measure(BackgroundRendererModel.prototype, 'render', '#render()');

BackgroundRendererModel.init();