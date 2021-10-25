import {
  StorageDriver,
  StorageDriverError,
  StorageDriverAuthorizationError,
  StorageDriverNotFoundError,
} from '@composer/core';

import { Dropbox } from 'dropbox';
import { arrayBufferToBinaryString, blobToBinaryString } from 'blob-util'


export class Driver extends StorageDriver.Driver {

  /**
   * Create a Dropbox storage driver
   * 
   * @param {object} options
   * @param {string} options.clientId - OAuth2 client ID
   * @param {string} options.applicationUrl - URL to Harmonicon instance
   * @param {string} options.accessToken - access token for authorized user (if already authorized)
   * @param {string} options.queueWaitTime - number of ms between queue runs
   * @param {string} options.idStringDelimiter - delimiter for id parts
   */
  constructor(options) {
    super({
      accessToken: null,
      applicationUrl: typeof document !== 'undefined' ? document.location : null,
      clientId: null,
      idStringDelimiter: ':',
      queueWaitTime: 1000,
      ...options
    });

    this.dropbox = new Dropbox({
      clientId: options.clientId,
      accessToken: options.accessToken,
    });

    // In-memory object cache
    this.cache = {};

    // Promises to execute in background
    this.queue = [];

  }

  get prefix () {
    return this.options.prefix || 'data';
  }

  get root () {
    return `/${this.prefix}`;
  }

  /**
   * Enqueue an asyncronous background request.  Returns size of queue.
   * 
   * @param {promise} fn - promise to be executed in background
   * @return {number}
   */
  async enqueue(fn) {
    this.queue.push(fn);

    (async function pop() {
      this.logger.info(`#enqueue() queue = ${this.queue.length}`);

      await (this.queue.shift())()
        .catch((error) => {
          this.logger.error(error);
        });

      if (this.queue.length > 0) {
        setTimeout(pop.bind(this), this.options.queueWaitTime);
      }
      else {
        this.logger.info('#enqueue() done');
      }
    }.bind(this))();

    return this.queue.length;
  }

  async getAuthenticationUrl({
    returnPath = '/'
  } = {}) {
    return this.dropbox.auth.getAuthenticationUrl(`${this.options.applicationUrl}${returnPath}`);
  }

  /**
   * Convert an ID to a storage key.
   * 
   * @param {string|array} id
   * @returns {string}
   */
  idToKey(id) {
    id = Array.isArray(id)
      ? id // [ 'a', 'b', 'c' ]
      : id.split(this.options.idStringDelimiter); // 'a:b:c'

    return `${[ this.root ].concat(id).join('/')}.json`;
  }

  /**
   * Explode a storage key to a parts array.
   * 
   * @param {string} key 
   * @returns {array}
   */
  keyToId(key) {
    const prefixRegExp = new RegExp(`^${this.root}/`);

    if (!key.match(prefixRegExp)) {
      throw new TypeError(`Storage key "${key}" appears to not have the correct prefix.`)
    }

    return key
      .replace(prefixRegExp, '')
      .replace(/\.json$/, '')
      .split('/')
      .join(this.options.idStringDelimiter);
  }

  /**
   * Decode raw data from storage.
   * 
   * @param {string} data 
   * @returns {object}
   */
  decode(data) {
    if (data && typeof data === 'string') {
      return JSON.parse(data);
    }
    else {
      return null;
    }
  }

  /**
   * Encode an object for storage.
   * 
   * @param {object} data 
   * @returns {string}
   */
  encode(data) {
    return JSON.stringify(data);
  }

  /**
   * Map a Dropbox error to a standard error or re-throw original.
   * 
   * @param {error} error 
   */
  resolveError(error) {
    if (error.status === 400) {
      throw new StorageDriverAuthorizationError(
        `Authorization error: ${error.error.error_summary || error.message} (${error.status})`
      );
    }
    else if (error.status === 409) {
      throw new StorageDriverNotFoundError(
        `Object not found: ${error.error.error_summary || error.message} (${error.status})`
      );
    }
    else if (error.status) {
      throw new StorageDriverError(
        `Unresolved error: ${error.error.error_summary || error.message} (${error.status})`
      );
    }
    else {
      throw error;
    }
  }

  /**
   * Catch not-found errors and replace them with undefined.
   * 
   * @param {error} error 
   */
  resolveNotFoundError(error) {
    if (error instanceof StorageDriverNotFoundError) {
      return undefined;
    }
    else {
      throw error;
    }
  }

  /**
   * Refresh current access token.
   * 
   * @returns {string} access token
   */
  async refreshToken() {
    return this.dropbox.auth.checkAndRefreshAccessToken()
      .then(() => (this.options.accessToken = this.dropbox.auth.accessToken));
  }

  /**
   * Check if an object exists in storage.
   * 
   * @param {string|array} id
   * @returns {boolean}
   */
  async exists(id) {
    const params = {
      path: this.idToKey(id),
    };

    this.logger.debug(`#exists() ${params.path}`);

    return this.dropbox.filesGetMetadata(params)
      .catch(this.resolveError)
      .catch(this.resolveNotFoundError)
      .then((response) => (!!response));
  }

  /**
   * Get an object from storage or create it if it does not exist.
   * 
   * @param {string} id 
   * @param {function} fn 
   * @returns {object}
   */
  async get(id, fn) {
    if (fn && !(await this.exists(id))) {
      debugger;
      const results = await fn();
      await this.set(id, results);
      return results;
    }

    const params = {
      path: this.idToKey(id),
    };

    this.logger.debug(`#get() ${params.path}`);

    // If object is cached locally, return it instead
    if (this.cache[params.path]) {
      return this.cache[params.path];
    }

    return this.dropbox.filesDownload(params)
      .catch(this.resolveError)
      .catch(this.resolveNotFoundError)
      .then(async (response) => {
        return response
          ? this.decode(await blobToBinaryString(response.result.fileBlob))
          : undefined;
      });
  }

  /**
   * Write an object to storage.
   * 
   * Documentation:
   * https://dropbox.github.io/dropbox-sdk-js/global.html#FilesCommitInfo
   * 
   * @param {string} id 
   * @param {object} data 
   * @returns {boolean}
   */
  async set(id, data) {
    const params = {
      path: this.idToKey(id),
      autorename: false,
      contents: this.encode(data),
      strict_conflict: false,
      mode: { '.tag': 'overwrite' },
      mute: true,
    };

    this.logger.debug(`#set() ${params.path} ${params.contents.substring(0, 50)}...`);

    this.cache[params.path] = data;

    return this.enqueue(async () => {
      return this.dropbox.filesUpload(params)
        .catch(this.resolveError)
        .then(() => (true));
    });
  }

  /**
   * Delete an object from storage.
   * 
   * @param {string} id 
   * @returns {boolean}
   */
  async unset(id) {
    const params = {
      path: this.idToKey(id),
    };

    this.logger.debug(`#unset() ${params.path}`);

    return this.dropbox.filesDeleteV2(params)
      .catch(this.resolveError)
      .catch(this.resolveNotFoundError)
      .then(() => (true));
  }

  /**
   * Erase contents of storage.
   * 
   * @returns {boolean}
   */
   async flush() {
    const params = {
      path: this.root,
    };

    this.logger.debug(`#flush() ${params.path}`);

    return this.dropbox.filesDeleteV2(params)
      .catch(this.resolveError)
      .catch(this.resolveNotFoundError)
      .then(() => (true));
  }

  /**
   * Get a list of objects in storage.
   * 
   * @param {object} options
   * @param {boolean} includeMetadata - include additional information
   * @param {string} query - optional query to search by
   * @returns {array}
   */
  async list ({
    query = '**/*.json',
    includeMetadata = false
  } = {}) {
    const params = {
      query: `${query}`
    };

    this.logger.debug(`#list() ${params.query}`);

    return this.dropbox.filesSearchV2(params)
      .catch(this.resolveError)
      .then((response) => {
        const result = response.result;

        return result.matches.map((match) => {
          const metadata = match.metadata.metadata;
          const id = this.keyToId(metadata.path_display);
          const updatedAt = new Date(metadata.server_modified);
          const size = metadata.size;

          return includeMetadata ? { size, updatedAt, id } : id;
        });
      });
  }

  async inspect(id = null) {
    if (id) {
      return this.get(id).then((d) => (console.log(d)));
    }
    else {
      return (await this.list()).map((id, i) => {
        this.logger.info(`[${i + 1}] ${id}`);
      });  
    }
  }

}