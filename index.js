'use strict';

const {resolve} = require('path');

const CleanCssPromise = require('clean-css-promise');
const constant = require('lodash/constant');
const BroccoliPersistentFilter = require('broccoli-persistent-filter');
const jsonStableStringify = require('json-stable-stringify');

const SOURCE_MAP_URL_PREFIX = ' sourceMappingURL=data:application/json;base64,';
const internalInstance = Symbol('internalInstance');
const internalOptions = Symbol('internalOptions');
const optionHash = Symbol('optionHash');

function toBroccoliCleanCssError(error) {
	error.message = error.message.replace('clean-css-promise', 'broccoli-clean-css');
	Error.captureStackTrace(error, toBroccoliCleanCssError);

	return error;
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

	cacheKeyProcessString(string, relativePath) {
		this[optionHash] = this[optionHash] || jsonStableStringify(this[internalOptions]);

		return `${this[optionHash]}${super.cacheKeyProcessString(string, relativePath)}`;
	}

	build() {
		if (typeof this[internalOptions].rebaseTo === 'string') {
			this[internalInstance] = new CleanCssPromise({
				...this[internalOptions],
				rebaseTo: resolve(this.inputPaths[0], this[internalOptions].rebaseTo)
			});
		} else {
			this[internalInstance] = new CleanCssPromise({
				rebaseTo: this.inputPaths[0],
				...this[internalOptions]
			});
		}

		return super.build();
	}

	async processString(str, fileName) {
		try {
			const {sourceMap, styles} = await this[internalInstance].minify({
				[resolve(this.inputPaths[0], fileName)]: {
					styles: str
				}
			});

			if (sourceMap) {
				return `${styles}
/*#${SOURCE_MAP_URL_PREFIX}${Buffer.from(JSON.stringify(sourceMap)).toString('base64')}*/
`;
			}

			return styles;
		} catch (err) {
			throw toBroccoliCleanCssError(err);
		}
	}
}

CleanCSSFilter.prototype.extensions = ['css'];
CleanCSSFilter.prototype.targetExtension = 'css';
Object.defineProperty(CleanCSSFilter.prototype, 'baseDir', {
	value: constant(__dirname),
	enumerable: true
});

module.exports = CleanCSSFilter;
