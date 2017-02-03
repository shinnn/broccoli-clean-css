'use strict';

const path = require('path');

const CleanCssPromise = require('clean-css-promise');
const BroccoliPersistentFilter = require('broccoli-persistent-filter');
const inlineSourceMapComment = require('inline-source-map-comment');
const jsonStableStringify = require('json-stable-stringify');

class CleanCSSFilter extends BroccoliPersistentFilter {
  constructor(inputTree, options) {
    super(inputTree, options);

    this.inputTree = inputTree;

    this.options = options || {};
    this._cleanCSS = null;
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
    const srcDir = this.inputPaths[0];
    const relativeTo = this.options.relativeTo;
    if (!relativeTo && relativeTo !== '' || typeof this.inputTree !== 'string') {
      this.options.relativeTo = path.resolve(srcDir, relativeTo || '.');
    }

    this._cleanCssPromise = new CleanCssPromise(this.options);

    return super.build();
  }

  processString(str) {
    return this._cleanCssPromise.minify(str).then(result => {
      if (result.sourceMap) {
        return `${result.styles}
${inlineSourceMapComment(result.sourceMap, {block: true})}
`;
      }

      return result.styles;
    });
  }
}

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';

module.exports = CleanCSSFilter;
