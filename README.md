# broccoli-clean-css

[![npm version](https://img.shields.io/npm/v/broccoli-clean-css.svg)](https://www.npmjs.com/package/broccoli-clean-css)
[![Build Status](https://travis-ci.com/shinnn/broccoli-clean-css.svg?branch=master)](https://travis-ci.com/shinnn/broccoli-clean-css)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/broccoli-clean-css.svg)](https://coveralls.io/github/shinnn/broccoli-clean-css?branch=master)

A [Broccoli](https://github.com/broccolijs/broccoli) plugin to minify CSS with [clean-css](https://github.com/jakubpawlowicz/clean-css)

```css
a {
  color: #ff0000;
}

b {
  /* nothing */
}
```

↓

```css
a{color:red}
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install --save-dev broccoli-clean-css
```

## API

```javascript
const BroccoliCleanCss = require('broccoli-clean-css');
```

### class BroccoliCleanCss(*node* [, *options*])

*node*: `string` (directory path) or `Object` ([Broccoli node](https://github.com/broccolijs/broccoli/blob/master/docs/node-api.md#part-2-node-api-specification))  
*options*: `Object` ([clean-css constructor options](https://github.com/jakubpawlowicz/clean-css#constructor-options))

```javascript
//Brocfile.js
const BroccoliCleanCss = require('broccoli-clean-css');

module.exports = new BroccoliCleanCss('path/to/styles');
```

There are some differences from the original [clean-css](https://www.npmjs.com/package/clean-css):

* `returnPromise` option defaults to `true` and cannot be disabled.
* All problems that clean-css considers as *warnings*, for example broken CSS syntax, are regarded as errors.

## License

Copyright (c) 2014 - 2019 [Watanabe Shinnosuke](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
