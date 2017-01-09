'use strict';

const {EOL} = require('os');
const fs = require('fs');
const path = require('path');

const {Builder} = require('broccoli');
const broccoliCleanCss = require('..');
const BroccoliFunnel = require('broccoli-funnel');
const rimraf = require('rimraf');
const test = require('tape');

rimraf.sync('tmp');

test('broccoli-clean-css', t => {
  t.plan(9);

  new Builder(broccoliCleanCss('test/fixtures')).build().then(dir => {
    fs.readFile(path.join(dir.directory, 'external-url.css'), 'utf8', (...args) => {
      t.deepEqual(args, [null, 'img{max-width:100%}'], 'should minify CSS.');
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

  const noRebaseTree = broccoliCleanCss(new BroccoliFunnel('test/fixtures'), {
    relativeTo: 'test/fixtures',
    strict: true
  }, {
    relativeToSourceTree: false
  });

  new Builder(noRebaseTree).build().then(dir => {
    fs.readFile(path.join(dir.directory, 'importer.css'), 'utf8', (err, content) => {
      t.strictEqual(err, null, 'Should minify importer.css');
      t.equal(
        content.replace(/\/\*.*/, ''),
        'b{color:red}',
        'should resolve @import rules from the specified directory.'
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
    fs.readFile(path.join(dir.directory, 'importer.css'), 'utf8', function(...args) {
      var expected = [
        '/*! header */',
        'a{font:18px}',
        'a{background:url(/fixtures/nested/bg.jpg)}'
      ].join(EOL);

      t.deepEqual(args, [null, expected], 'should support clean-css options.');
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
