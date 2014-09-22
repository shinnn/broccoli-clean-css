'use strict';

var Filter = require('broccoli-filter');
var CleanCSS = require('clean-css');
var path = require('path');

function CleanCSSFilter(inputTree, options) {
  if (!(this instanceof CleanCSSFilter)) {
    return new CleanCSSFilter(inputTree, options);
  }

  this.inputTree = inputTree;
  this.options = options || {};
  this.cleaner = null;
}

CleanCSSFilter.prototype = Object.create(Filter.prototype);
CleanCSSFilter.prototype.constructor = CleanCSSFilter;

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';

// add hook to read
CleanCSSFilter.prototype.read = function(readTree) {
  var self = this, args = arguments;

  return readTree(this.inputTree).then(function (srcDir) {
    // rewrite relative paths to resolve against the source tree
    self.options.root = path.resolve(srcDir, self.options.root || '.');
    if (self.options.relativeTo) {
      self.options.relativeTo = path.resolve(srcDir, self.options.relativeTo);
    }

    self.cleaner = new CleanCSS(self.options);

    return Filter.prototype.read.apply(self, args);
  });
};

CleanCSSFilter.prototype.processString = function(str) {
  return this.cleaner.minify(str);
};

module.exports = CleanCSSFilter;
