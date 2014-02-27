# broccoli-clean-css

[![NPM version](https://badge.fury.io/js/broccoli-clean-css.png)](http://badge.fury.io/js/broccoli-clean-css)
[![Build Status](https://travis-ci.org/shinnn/broccoli-clean-css.png?branch=master)](https://travis-ci.org/shinnn/broccoli-clean-css)
[![Dependency Status](https://david-dm.org/shinnn/broccoli-clean-css.png)](https://david-dm.org/shinnn/broccoli-clean-css)
[![devDependency Status](https://david-dm.org/shinnn/broccoli-clean-css/dev-status.png)](https://david-dm.org/shinnn/broccoli-clean-css#info=devDependencies)

CSS minifier for [Broccoli](https://github.com/joliss/broccoli) with [clean-css](https://github.com/GoalSmashers/clean-css)

## Installation

```
npm i --save broccoli-clean-css
```

Make sure you have installed [Node](http://nodejs.org/) before running this command.

## Example

```javascript
var cleanCSS = require('broccoli-clean-css');
tree = cleanCSS(tree, options);
```

## API

### cleanCSS(tree, options)

See [available options for clean-css](https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically).

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT LIcense](./LICENSE).
