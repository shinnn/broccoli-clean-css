'use strict';

var fs = require('fs');
var path = require('path');

var Builder = require('broccoli').Builder;
var cleanCSS = require('..');
var Funnel = require('broccoli-funnel');
var rimraf = require('rimraf');
var test = require('tape');

rimraf.sync('tmp');

test('broccoli-clean-css', function(t) {
  t.plan(7);

  new Builder(cleanCSS('test/fixtures')).build().then(function(dir) {
    fs.readFile(path.join(dir.directory, 'importer.css'), 'utf8', function(err, content) {
      t.deepEqual([err, content], [null, 'b{color:red}'], 'should minify CSS.');
    });
  }, t.fail);

  var tree = new Funnel('test/fixtures', {destDir: ''});
  tree = cleanCSS(tree, {
    sourceMap: true,
    strict: true
  });
  tree = new Funnel('test/fixtures', {destDir: 'foo'});
  tree = cleanCSS(tree, {
    relativeTo: 'foo',
    sourceMap: true,
    strict: true
  });

  new Builder(tree).build().then(function(dir) {
    fs.readFile(path.join(dir.directory, 'foo/importer.css'), 'utf8', function(err, content) {
      t.strictEqual(err, null, 'should support `sourceMap` option.');
      t.equal(
        content.replace(/\/\*.*/, ''),
        'b{color:red}\n\n',
        'should resolve @import rules from the temporary directory.'
      );
      t.ok(
        /\/\* # sourceMappingURL/.test(content),
        'should append base64-encoded source map comment to the files.'
      );
    });
  }, t.fail);

  new Builder(cleanCSS('test/fixtures', {
    keepSpecialComments: 1,
    keepBreaks: true,
    advanced: false,
    root: 'test',
    relativeTo: 'test/fixtures/nested'
  })).build().then(function(dir) {
    fs.readFile(path.join(dir.directory, 'importer.css'), 'utf8', function(err, content) {
      var expected = [
        '/*! header */',
        'a{font:18px}',
        'a{background:url(/fixtures/nested/bg.jpg)}'
      ].join('\n');

      t.deepEqual([err, content], [null, expected], 'should support clean-css options.');
    });
  }, t.fail);

  var options = {
    relativeTo: 'foo',
    strict: true
  };

  new Builder(cleanCSS('test/fixtures', options)).build().catch(function(err) {
    t.ok(
      /Broken @import declaration/.test(err.message),
      'should fail to minify CSS on error when `strict` option is enabled.'
    );
    t.deepEqual(options, {
      relativeTo: 'foo',
      strict: true
    }, 'should not modify the original option object.');
  });
});
