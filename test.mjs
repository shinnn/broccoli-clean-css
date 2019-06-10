import {strict as assert} from 'assert';

import BroccoliCleanCss from '.';
import broccoliFixture from 'broccoli-fixture';
import cloneDeep from 'lodash/cloneDeep';
import test from 'testit';

const {build, Node} = broccoliFixture;

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

test('throw an error when it takes non-object second argument', () => {
	assert.throws(() => new BroccoliCleanCss('fixture', '\0'), {
		name: 'TypeError',
		message: /Expected an <Object> to specify clean-css options.*but got '\\u0000' \(string\)\./u
	});
});

test('throw an error when it takes an invalid option', () => {
	assert.throws(() => new BroccoliCleanCss('fixture', {returnPromise: true}), {
		message: /broccoli-clean-css automatically enables `returnPromise` option and it's unconfigurable/u
	});
});

test('minify CSS', async () => {
	const files = await build(new BroccoliCleanCss(new Node({
		'non-css.txt': 'b { }; /* This is not a CSS file and should not be modified. */',
		'style.css': 'p {border: 0px 0px 0px 0px}'
	})));

	assert.equal(files['style.css'], 'p{border:0}');
	assert.equal(files['non-css.txt'], 'b { }; /* This is not a CSS file and should not be modified. */');
});

test('support clean-css options', async () => {
	const files = await build(new BroccoliCleanCss(new Node({
		'importer.css': '@import "imported.css";',
		'imported.css': 'b { color: rgb(255, 0, 0); }\nb { background: blue; }'
	}), options));

	assert.equal(files['importer.css'].replace(/\/\*.*/u, ''), 'b{color:red;background:#00f}\n\n');
	assert(/\/\*# sourceMappingURL/u.test(files['importer.css']));
});

test('do not modify an original options object', () => {
	assert.deepEqual(options, clonedOptions);
});

test('read CSS files from the specified directory', async () => {
	assert.rejects(async () => {
		await build(new BroccoliCleanCss('fixture'));
	}, ({message}) => message.startsWith('broken-import.css: An error occured while optimizing CSS with clean-css:'));
});
