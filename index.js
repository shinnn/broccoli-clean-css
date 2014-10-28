'use strict';

var path = require('path');

var CleanCSS = require('clean-css');
var Filter = require('broccoli-filter');

function CleanCSSFilter(inputTree, options) {
  if (!(this instanceof CleanCSSFilter)) {
    return new CleanCSSFilter(inputTree, options);
  }

  this.inputTree = inputTree;
  this.options = options || {};
  this._cleanCSS = null;
}

CleanCSSFilter.prototype = Object.create(Filter.prototype);
CleanCSSFilter.prototype.constructor = CleanCSSFilter;

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';

CleanCSSFilter.prototype.read = function(readTree) {
  var self = this;
  var args = arguments;

  return readTree(this.inputTree).then(function(srcDir) {
    self.options.root = path.resolve(srcDir, self.options.root || '.');
    if (self.options.relativeTo) {
      self.options.relativeTo = path.resolve(srcDir, self.options.relativeTo);
    }

    self._cleanCSS = new CleanCSS(self.options);

    return Filter.prototype.read.apply(self, args);
  });
};

CleanCSSFilter.prototype.processString = function(str) {
  return this._cleanCSS.minify(str);
};

module.exports = CleanCSSFilter;
