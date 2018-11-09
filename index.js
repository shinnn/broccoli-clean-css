'use strict';

const path = require('path');

const CleanCssPromise = require('clean-css-promise');
const BroccoliPersistentFilter = require('broccoli-persistent-filter');
const jsonStableStringify = require('json-stable-stringify');

const internalInstance = Symbol('internalInstance');
const internalOptions = Symbol('internalOptions');
const optionHash = Symbol('optionHash');

function toBroccoliCleanCssError(error) {
	error.message = error.message.replace('clean-css-promise', 'broccoli-clean-css');
	Error.captureStackTrace(error, toBroccoliCleanCssError);

	return error;
}

function onFulfilled({sourceMap, styles}) {
	if (sourceMap) {
		return `${styles}
/*# sourceMappingURL=data:application/json;base64,${Buffer.from(JSON.stringify(sourceMap)).toString('base64')}*/
`;
	}

	return styles;
}

function onRejected(err) {
	return Promise.reject(toBroccoliCleanCssError(err));
}

class CleanCSSFilter extends BroccoliPersistentFilter {
	constructor(...args) {
		super(...args);

		this.inputTree = args.shift();

		try {
			new CleanCssPromise(...args);
		} catch (err) {
			throw toBroccoliCleanCssError(err);
		}

		this[internalOptions] = args[0] || {};
	}

	baseDir() { // eslint-disable-line class-methods-use-this
		return __dirname;
	}

	cacheKeyProcessString(string, relativePath) {
		this[optionHash] = this[optionHash] || jsonStableStringify(this[internalOptions]);

		return `${this[optionHash]}${super.cacheKeyProcessString(string, relativePath)}`;
	}

	build() {
		if (typeof this[internalOptions].rebaseTo === 'string') {
			this[internalInstance] = new CleanCssPromise(Object.assign({}, this[internalOptions], { // eslint-disable-line prefer-object-spread
				rebaseTo: path.resolve(this.inputPaths[0], this[internalOptions].rebaseTo)
			}));
		} else {
			this[internalInstance] = new CleanCssPromise(Object.assign({ // eslint-disable-line prefer-object-spread
				rebaseTo: this.inputPaths[0]
			}, this[internalOptions]));
		}

		return super.build();
	}

	processString(str, fileName) {
		return this[internalInstance].minify({
			[path.resolve(this.inputPaths[0], fileName)]: {
				styles: str
			}
		}).then(onFulfilled, onRejected); // eslint-disable-line promise/prefer-await-to-then
	}
}

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';

module.exports = CleanCSSFilter;
