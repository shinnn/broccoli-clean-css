'use strict';

var path = require('path');

var CleanCSS = require('clean-css');
var Filter = require('broccoli-filter');
var inlineSourceMapComment = require('inline-source-map-comment');

function CleanCSSFilter(inputTree, options) {
  if (!(this instanceof CleanCSSFilter)) {
    return new CleanCSSFilter(inputTree, options);
  }

  this.inputTree = inputTree;

  Filter.call(this, inputTree, options);

  this.options = options || {};
  this._cleanCSS = null;
}

CleanCSSFilter.prototype = Object.create(Filter.prototype);
CleanCSSFilter.prototype.constructor = CleanCSSFilter;

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';

CleanCSSFilter.prototype.build = function() {
  var srcDir = this.inputPaths[0];
  var relativeTo = this.options.relativeTo;
  if (!relativeTo && relativeTo !== '' || typeof this.inputTree !== 'string') {
    this.options.relativeTo = path.resolve(srcDir, relativeTo || '.');
  }

  this._cleanCSS = new CleanCSS(this.options);

  return Filter.prototype.build.call(this);
};

CleanCSSFilter.prototype.processString = function(str) {
  var result = this._cleanCSS.minify(str);
  if (result.errors.length > 0 && this.options.strict) {
    throw new Error(result.errors.join('\n'));
  }

  if (result.sourceMap) {
    return result.styles + '\n' +
           inlineSourceMapComment(result.sourceMap, {block: true}) + '\n';
  }

  return result.styles;
};

module.exports = CleanCSSFilter;
