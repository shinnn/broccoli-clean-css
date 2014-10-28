'use strict';

module.exports = require('./index')('test/fixtures', {
  keepSpecialComments: 1,
  keepBreaks: true,
  noAdvanced: true
});
