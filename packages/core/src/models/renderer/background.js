import audioEncoder from 'audio-encoder';
import { RendererError } from '../../errors';
import { RendererBaseModel } from './base';

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

    if (!duration) {
      return this;;
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
        this.logger.info(`#encode() progress = ${Math.round(pct * 100)}%`);
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

}

BackgroundRendererModel.init();