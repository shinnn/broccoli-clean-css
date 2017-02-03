'use strict';

const BroccoliCleanCss = require('.');
const {build, Node} = require('broccoli-fixture');
const test = require('tape');

test('broccoli-clean-css', t => {
  t.plan(4);

  build(new BroccoliCleanCss(new Node({
    'non-css.txt': ' div { } ; ',
    'remote-url.css': '@import "https://raw.githubusercontent.com/mrmrs/css-images/master/src/css-images.css";'
  }))).then(files => {
    t.strictEqual(files['remote-url.css'], 'img{max-width:100%}', 'should minify CSS.');
    t.strictEqual(files['non-css.txt'], ' div { } ; ', 'should ignore non-CSS files.');
  }).catch(t.fail);

  build(new BroccoliCleanCss(new Node({
    'importer.css': '@import "imported.css";',
    'imported.css': 'b { color: red; }'
  }), {sourceMap: true})).then(({'importer.css': result}) => {
    t.strictEqual(result.replace(/\/\*.*/, ''), 'b{color:red}\n\n', 'should resolve @import rules.');
    t.ok(
      /\/\*# sourceMappingURL/.test(result),
      'should append base64-encoded source map comment to the files.'
    );
  }).catch(t.fail);
});

test('broccoli-clean-css with a directory path', t => {
  t.plan(1);

  build(new BroccoliCleanCss('fixture', {relativeTo: 'foo'})).catch(({message}) => {
    t.ok(
      message.startsWith('broken-import.css: Broken @import declaration of "example.com/__not_found__"'),
      'should read CSS files from the specified directory.'
    );
  }).catch(t.fail);
});
