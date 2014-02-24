'use strict';

var assert = require('assert');
var fs = require('fs');

var expected = '#container{font:18px}';

describe('broccoli-clean-css', function () {
  it('should run clean-css', function (done) {
    fs.readFile('test/actual/src.css', function(err, data) {
      assert.strictEqual(data.toString(), expected);
      done();
    });
  });
});