'use strict';

module.exports = function (broccoli) {
  return require('./index')(broccoli.makeTree('test/fixture'), {
    keepSpecialComments: 1,
    keepBreaks: true,
    noAdvanced: true,
    root: 'test/fixture'
  });
};
