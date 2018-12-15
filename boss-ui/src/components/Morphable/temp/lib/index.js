'use strict';

module.exports = function () {
  throw new Error("Don't instantiate Morphable directly! Use import Morphable from 'react-morphable'");
};

module.exports.Morphable = require('./build/Morphable').default;
module.exports.MorphableCore = require('./build/MorphableCore').default;