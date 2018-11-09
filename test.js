'use strict';

const BroccoliCleanCss = require('.');
const {build, Node} = require('broccoli-fixture');
const cloneDeep = require('lodash/cloneDeep');
const test = require('tape');

test('broccoli-clean-css', async t => {
	t.throws(
		() => new BroccoliCleanCss('fixture', '\0'),
		/TypeError.*Expected an <Object> to specify clean-css options.*but got '\\u0000' \(string\)\./u,
		'should throw an error when it takes non-object second argument.'
	);

	t.throws(
		() => new BroccoliCleanCss('fixture', {returnPromise: true}),
		/broccoli-clean-css automatically enables `returnPromise` option and it's unconfigurable/u,
		'should throw an error when it takes an invalid option.'
	);

	const files0 = await build(new BroccoliCleanCss(new Node({
		'non-css.txt': ' div { } ; ',
		'style.css': 'p {border: 0px 0px 0px 0px}'
	}))).catch(t.fail);

	t.equal(files0['style.css'], 'p{border:0}', 'should minify CSS.');
	t.equal(files0['non-css.txt'], ' div { } ; ', 'should ignore non-CSS files.');

	const options = {
		level: {
			'2': {
				restructureRules: true
			}
		},
		sourceMap: true,
		persist: true
	};
	const clonedOptions = cloneDeep(options);

	const files1 = await build(new BroccoliCleanCss(new Node({
		'importer.css': '@import "imported.css";',
		'imported.css': 'b { color: rgb(255, 0, 0); }\nb { background: blue; }'
	}), options)).catch(t.fail);

	t.equal(
		files1['importer.css'].replace(/\/\*.*/u, ''),
		'b{color:red;background:#00f}\n\n',
		'should resolve @import rules.'
	);

	t.deepEqual(options, clonedOptions, 'should not modify original options.');

	t.ok(
		/\/\*# sourceMappingURL/u.test(files1['importer.css']),
		'should append base64-encoded source map comment to the files.'
	);

	t.end();
});

test('broccoli-clean-css with a directory path', async t => {
	try {
		await build(new BroccoliCleanCss('fixture', {rebaseTo: 'foo'}));
	} catch ({message}) {
		t.ok(
			message.startsWith('broken-import.css: An error occured while optimizing CSS with clean-css:'),
			'should read CSS files from the specified directory.'
		);
	}

	t.end();
});
