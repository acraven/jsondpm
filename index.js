'use strict';

const diff = require('./modules/diff');
const patch = require('./modules/patch');
const reverse = require('./modules/reverse');

module.exports = {
  diff,
  patch,
  reverse
};
