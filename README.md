# broccoli-clean-css

[![NPM version](https://img.shields.io/npm/v/broccoli-clean-css.svg)](https://www.npmjs.com/package/broccoli-clean-css)
[![Build Status](https://travis-ci.org/shinnn/broccoli-clean-css.svg?branch=master)](https://travis-ci.org/shinnn/broccoli-clean-css)
[![Build status](https://ci.appveyor.com/api/projects/status/hxys0gltb6qpj0gm?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/broccoli-clean-css)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/broccoli-clean-css.svg)](https://coveralls.io/r/shinnn/broccoli-clean-css)

[clean-css](https://github.com/jakubpawlowicz/clean-css) plugin for [Broccoli](https://github.com/broccolijs/broccoli)

```css
a {
  color: #FF0000;
}

a {
  border-radius: 4px 4px 4px 4px;
}
```

↓

```css
a{color:red;border-radius:4px}
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install --save-dev broccoli-clean-css
```

## API

```javascript
const BroccoliCleanCss = require('broccoli-clean-css');
```

### class BroccoliCleanCss(*node* [, *options*])

*node*: `String` (directory path) or `Object` ([Broccoli node](https://github.com/broccolijs/broccoli/blob/master/docs/node-api.md#part-2-node-api-specification))  
*options*: `Object` ([clean-css constructor options](https://github.com/jakubpawlowicz/clean-css#constructor-options))

```javascript
//Brocfile.js
const BroccoliCleanCss = require('broccoli-clean-css');

module.exports = new BroccoliCleanCss('path/to/styles');
```

There are some differences from the original [clean-css](https://www.npmjs.com/package/clean-css):

* `rebaseTo` option is regarded as relative to the Broccoli target path.
* `returnPromise` option defaults to `true` and cannot be disabled.
* All problems that clean-css considers as *warnings*, for example broken CSS syntax, are regarded as errors.

## License

Copyright (c) 2014 - 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
