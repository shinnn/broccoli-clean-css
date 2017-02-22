'use strict';

const path = require('path');

const CleanCssPromise = require('clean-css-promise');
const BroccoliPersistentFilter = require('broccoli-persistent-filter');
const jsonStableStringify = require('json-stable-stringify');
const sourceMapToComment = require('source-map-to-comment');

const internalInstance = Symbol('internalInstance');
const internalOptions = Symbol('internalOptions');
const optionHash = Symbol('optionHash');

function toBroccoliCleanCssError(err) {
  err.message = err.message.replace('clean-css-promise', 'broccoli-clean-css');
  return err;
}

function validateOptions(options) {
  try {
    new CleanCssPromise(options);
  } catch (err) {
    throw toBroccoliCleanCssError(err);
  }
}

function onFulfilled(result) {
  if (result.sourceMap) {
    return `${result.styles}\n${sourceMapToComment(result.sourceMap, {type: 'css'})}\n`;
  }

  return result.styles;
}

function onRejected(err) {
  return Promise.reject(toBroccoliCleanCssError(err));
}

class CleanCSSFilter extends BroccoliPersistentFilter {
  constructor(inputTree, options) {
    super(inputTree, options);

    this.inputTree = inputTree;

    validateOptions(options);
    this[internalOptions] = options || {};
  }

  baseDir() { // eslint-disable-line class-methods-use-this
    return __dirname;
  }

  cacheKeyProcessString(string, relativePath) {
    this[optionHash] = this[optionHash] || jsonStableStringify(this[internalOptions]);

    return `${this[optionHash]}${super.cacheKeyProcessString(string, relativePath)}`;
  }

  build() {
    if (typeof this[internalOptions].rebaseTo === 'string') {
      this[internalInstance] = new CleanCssPromise(Object.assign({}, this[internalOptions], {
        rebaseTo: path.resolve(this.inputPaths[0], this[internalOptions].rebaseTo)
      }));
    } else {
      this[internalInstance] = new CleanCssPromise(Object.assign({
        rebaseTo: this.inputPaths[0]
      }, this[internalOptions]));
    }

    return super.build();
  }

  processString(str, fileName) {
    return this[internalInstance].minify({
      [path.resolve(this.inputPaths[0], fileName)]: {
        styles: str
      }
    }).then(onFulfilled, onRejected);
  }
}

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';

module.exports = CleanCSSFilter;
