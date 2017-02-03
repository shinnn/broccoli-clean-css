'use strict';

const BroccoliCleanCss = require('.');
const {build, Node} = require('broccoli-fixture');
const cloneDeep = require('lodash/clonedeep');
const test = require('tape');

test('broccoli-clean-css', async t => {
  const files0 = await build(new BroccoliCleanCss(new Node({
    'non-css.txt': ' div { } ; ',
    'style.css': 'p {border: 0px 0px 0px 0px}'
  }))).catch(t.fail);

  t.strictEqual(files0['style.css'], 'p{border:0}', 'should minify CSS.');
  t.strictEqual(files0['non-css.txt'], ' div { } ; ', 'should ignore non-CSS files.');

  const options = {
    level: {
      '2': {
        restructureRules: true
      }
    },
    sourceMap: true
  };
  const clonedOptions = cloneDeep(options);

  const files1 = await build(new BroccoliCleanCss(new Node({
    'importer.css': '@import "imported.css";',
    'imported.css': 'b { color: rgb(255, 0, 0); }\nb { background: blue; }'
  }), options)).catch(t.fail);

  t.strictEqual(
    files1['importer.css'].replace(/\/\*.*/, ''),
    'b{color:red;background:#00f}\n\n',
    'should resolve @import rules.'
  );

  t.deepEqual(options, clonedOptions, 'should not modify original options.');

  t.ok(
    /\/\*# sourceMappingURL/.test(files1['importer.css']),
    'should append base64-encoded source map comment to the files.'
  );

  t.end();
});

test('broccoli-clean-css with a directory path', t => {
  t.plan(1);

  build(new BroccoliCleanCss('fixture', {rebaseTo: 'foo'})).catch(({message}) => {
    t.ok(
      message.startsWith('broken-import.css: An error found while optimizing CSS with clean-css:\n'),
      'should read CSS files from the specified directory.'
    );
  }).catch(t.fail);
});
