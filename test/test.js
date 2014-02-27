'use strict';

var assert = require('assert');
var fs = require('fs');

var expected = '/*! header */\n' +
               '#cnt{font:18px}\n' +
               '#cnt{background:url(bg.jpg)}';

describe('broccoli-clean-css', function () {
  it('should run clean-css', function (done) {
    fs.readFile('test/actual/importer.css', function(err, data) {
      if (err) done(err);
      assert.strictEqual(data.toString(), expected);
      done();
    });
  });
});
