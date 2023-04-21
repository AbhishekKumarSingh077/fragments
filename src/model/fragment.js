// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const md = require('markdown-it')({
  html: true,
});
//var mime = require('mime-types');
const sharp = require('sharp');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const logger = require('../logger');

class Fragment {
  constructor({ id, ownerId, created = new Date(), updated = new Date(), type, size = 0 }) {
    if (!ownerId) {
      throw new Error('The ownerId is missing and required');
    } else {
      this.ownerId = ownerId;
    }
    if (Fragment.isSupportedType(type)) {
      this.type = type;
    } else {
      throw new Error('Invalid Type');
    }
    if (size < 0) {
      throw new Error('Negative value of size is not possible');
    } else if (typeof size !== 'number') {
      throw new Error('Size must be a number type');
    } else {
      this.size = size || 0;
    }
    this.id = id || randomUUID();
    this.created = created || created.toLocaleString();
    this.updated = updated || updated.toISOString();
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error('Fragment not found');
    }
    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */

  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    logger.info('Data check');
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data does not serve as a buffer');
    }
    this.size = data.length;
    logger.info('Data length is being set!');
    await this.save();
    logger.info('Data is being saved!');
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    //return this.mimeType === 'text/plain';
    if (this.mimeType.match(/text\/+/)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    //return ['text/plain'];
    if (this.mimeType === 'text/plain') {
      return ['text/plain'];
    } else if (this.mimeType === 'text/markdown') {
      return ['text/plain', 'text/markdown', 'text/html'];
    } else if (this.mimeType === 'text/html') {
      return ['text/plain', 'text/html'];
    } else if (this.mimeType === 'application/json') {
      return ['text/plain', 'application/json'];
    } else {
      return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if (
      value == 'text/plain' ||
      value == 'text/plain; charset=utf-8' ||
      value == 'text/markdown' ||
      value == 'text/html' ||
      value == 'application/json' ||
      value == 'image/png' ||
      value == 'image/jpeg' ||
      value == 'image/gif' ||
      value == 'image/webp'
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the data converted to the desired type
   * @param {Buffer} data fragment data to be converted
   * @param {string} extension the type extension you want to convert to (desired type)
   * @returns {Buffer} converted fragment data
   */

  convertDataType(data, type) {
    switch (type) {
      case 'text/html':
        if (this.type === 'text/markdown') {
          return md.render(data.toString());
        }
        return data;
      case 'image/png':
        return sharp(data).toFormat('png');
      case 'image/jpeg':
        return sharp(data).toFormat('jpeg');
      case 'image/gif':
        return sharp(data).toFormat('gif');
      case 'image/webp':
        return sharp(data).toFormat('webp');
      case 'text/plain':
        return data.toString();
      default:
        return data;
    }
  }
}
module.exports.Fragment = Fragment;
