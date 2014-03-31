var Process = require('../staniol/packages.js').packages.Process,
    fs = require('fs');

var assert = require('assert');
describe('Packages', function(){
    describe('Instance', function(){
        it('should throw Error when json is not populated', function(){
            assert.throws(function () {
                var packages = new Process ('s');
            }, Error);
        });
        it('should create new instance when json is populated', function () {
            assert.doesNotThrow(function () {
                var packages = new Process ('test/data/testPackages.json');
            }, Error);
        });
        it('should contain config as object', function () {
            var packages = new Process ({packages : [ "less-border-mixins", "less-border-mixins" ]});
            var expectation =  {packages : [ "less-border-mixins", "less-border-mixins" ]};
            assert.deepEqual (packages.packages, expectation); // compare with json vs. object
        });
    });
});