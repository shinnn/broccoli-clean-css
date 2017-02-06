'use strict';

const path = require('path');

const CleanCssPromise = require('clean-css-promise');
const BroccoliPersistentFilter = require('broccoli-persistent-filter');
const jsonStableStringify = require('json-stable-stringify');
const sourceMapToComment = require('source-map-to-comment');

class CleanCSSFilter extends BroccoliPersistentFilter {
  constructor(inputTree, options) {
    super(inputTree, options);

    this.inputTree = inputTree;
    this.options = options || {};
  }

  baseDir() { // eslint-disable-line class-methods-use-this
    return __dirname;
  }

  cacheKeyProcessString(string, relativePath) {
    if (!this._optionsHash) {
      this._optionsHash = jsonStableStringify(this.options);
    }

    return `${this._optionsHash}${super.cacheKeyProcessString(string, relativePath)}`;
  }

  build() {
    this._cleanCssPromise = new CleanCssPromise(Object.assign({
      rebaseTo: path.resolve(this.inputPaths[0])
    }, this.options));

    return super.build();
  }

  processString(str, fileName) {
    return this._cleanCssPromise.minify({
      [path.resolve(this.inputPaths[0], fileName)]: {
        styles: str
      }
    }).then(result => {
      if (result.sourceMap) {
        return result.styles + '\n' + sourceMapToComment(result.sourceMap, {type: 'css'}) + '\n';
      }

      return result.styles;
    }, err => {
      err.message = err.message.replace('clean-css-promise', 'broccoli-clean-css');
      return Promise.reject(err);
    });
  }
}

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';

module.exports = CleanCSSFilter;
