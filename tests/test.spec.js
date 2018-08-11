'use strict';

var expect = require('chai').expect;
var testSubject = require('../index');

describe('index.js', function() {
   [1, 'A'].forEach(arg => {
      it(`should return ${arg} when passed ${arg}`, function() {
         var result = testSubject(arg);
         expect(result).to.equal(arg);
     });
   })
});
