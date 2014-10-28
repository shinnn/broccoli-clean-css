# broccoli-clean-css

[![NPM version](https://badge.fury.io/js/broccoli-clean-css.svg)](https://www.npmjs.org/package/broccoli-clean-css)
[![Build Status](https://travis-ci.org/shinnn/broccoli-clean-css.svg?branch=master)](https://travis-ci.org/shinnn/broccoli-clean-css)
[![Dependency Status](https://david-dm.org/shinnn/broccoli-clean-css.svg?theme=shields.io)](https://david-dm.org/shinnn/broccoli-clean-css)
[![devDependency Status](https://david-dm.org/shinnn/broccoli-clean-css/dev-status.svg?theme=shields.io)](https://david-dm.org/shinnn/broccoli-clean-css#info=devDependencies)

CSS minifier for [Broccoli](https://github.com/broccolijs/broccoli) with [clean-css](https://github.com/GoalSmashers/clean-css)

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

Install with [npm](https://github.com/npm/npm#npm1----node-package-manager).

```
npm i --save-dev broccoli-clean-css
```

## Usage

```javascript
var cleanCSS = require('broccoli-clean-css');
tree = cleanCSS(tree, options);
```

## API

### cleanCSS(tree, options)

See [available options for clean-css](https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically).

*Note that `relativeTo` option and `root` option are relative to the source tree.*

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
