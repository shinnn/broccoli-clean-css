'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {Builder} = require('broccoli');
const broccoliCleanCss = require('..');
const BroccoliFunnel = require('broccoli-funnel');
const rimraf = require('rimraf');
const test = require('tape');

rimraf.sync('tmp');

test('broccoli-clean-css', t => {
  t.plan(7);

  new Builder(broccoliCleanCss('test/fixtures')).build().then(dir => {
    fs.readFile(path.join(dir.directory, 'importer.css'), 'utf8', (err, content) => {
      t.deepEqual([err, content], [null, 'b{color:red}'], 'should minify CSS.');
    });
  }).catch(t.fail);

  const tree = broccoliCleanCss(new BroccoliFunnel('test/fixtures', {destDir: 'foo'}), {
    relativeTo: 'foo',
    sourceMap: true,
    strict: true
  });

  new Builder(tree).build().then(dir => {
    fs.readFile(path.join(dir.directory, 'foo/importer.css'), 'utf8', (err, content) => {
      t.strictEqual(err, null, 'should support `sourceMap` option.');
      t.equal(
        content.replace(/\/\*.*/, ''),
        'b{color:red}\n\n',
        'should resolve @import rules from the temporary directory.'
      );
      t.ok(
        /\/\*# sourceMappingURL/.test(content),
        'should append base64-encoded source map comment to the files.'
      );
    });
  }).catch(t.fail);

  new Builder(broccoliCleanCss('test/fixtures', {
    keepSpecialComments: 1,
    keepBreaks: true,
    advanced: false,
    root: 'test',
    relativeTo: 'test/fixtures/nested'
  })).build().then(dir => {
    fs.readFile(path.join(dir.directory, 'importer.css'), 'utf8', function(err, content) {
      var expected = [
        '/*! header */',
        'a{font:18px}',
        'a{background:url(/fixtures/nested/bg.jpg)}'
      ].join(os.EOL);

      t.deepEqual([err, content], [null, expected], 'should support clean-css options.');
    });
  }).catch(t.fail);

  var options = {
    relativeTo: 'foo',
    strict: true
  };

  new Builder(broccoliCleanCss('test/fixtures', options)).build().then(t.fail, err => {
    t.ok(
      /Broken @import declaration/.test(err.message),
      'should fail to minify CSS on error when `strict` option is enabled.'
    );
    t.deepEqual(options, {
      relativeTo: 'foo',
      strict: true
    }, 'should not modify the original option object.');
  }).catch(t.fail);
});
