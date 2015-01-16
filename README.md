# broccoli-clean-css

[![NPM version](https://img.shields.io/npm/v/broccoli-clean-css.svg?style=flat)](https://www.npmjs.com/package/broccoli-clean-css)
[![Build Status](https://travis-ci.org/shinnn/broccoli-clean-css.svg?branch=master)](https://travis-ci.org/shinnn/broccoli-clean-css)
[![Build status](https://ci.appveyor.com/api/projects/status/hxys0gltb6qpj0gm?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/broccoli-clean-css)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/broccoli-clean-css.svg?style=flat)](https://coveralls.io/r/shinnn/broccoli-clean-css)
[![Dependency Status](https://img.shields.io/david/shinnn/broccoli-clean-css.svg?style=flat&label=deps)](https://david-dm.org/shinnn/broccoli-clean-css)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/broccoli-clean-css.svg?style=flat&label=devDeps)](https://david-dm.org/shinnn/broccoli-clean-css#info=devDependencies)

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

[Use npm.](https://github.com/npm/npm#npm1----node-package-manager).

```sh
npm i --save-dev broccoli-clean-css
```

## API

```js
var cleanCSS = require('broccoli-clean-css');
```

### cleanCSS(*tree* [, *options*])

*tree*: `String` or `Object` (broccoli tree)  
*options*: `Object` (directly passed to [clean-css options](https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically))  
Return: `Function`

Note that `relativeTo` option is relative to the source tree by default.

```javascript
//Brocfile.js
var cleanCSS = require('broccoli-clean-css');

var app = 'styles';
app = cleanCSS(app);

module.exports = app;
```

#### options.strict

Type: `Boolean`  
Default: `false`  

If you set this option to `true`, build will be [rejected](https://promisesaplus.com/#point-30) when the CSS is corrupt.

## License

Copyright (c) [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
