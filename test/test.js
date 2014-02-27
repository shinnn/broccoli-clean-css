'use strict';

var assert = require('assert');
var fs = require('fs');

var expected = '/*! header */\n' +
               'b{font:18px}\n' +
               'b{color:red}';

describe('broccoli-clean-css', function () {
  it('should run clean-css', function (done) {
    fs.readFile('test/actual/simple.css', function(err, data) {
      if (err) done(err);
      assert.strictEqual(data.toString(), expected);
      done();
    });
  });
});
