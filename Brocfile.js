'use strict';

module.exports = require('./index')('test/fixture', {
    keepSpecialComments: 1,
    keepBreaks: true,
    noAdvanced: true,
    root: 'test/fixture'
  });
