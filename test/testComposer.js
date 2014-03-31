var Composer = require('../staniol/composer.js').Composer;
var assert = require('assert');

describe('Packages', function(){
    describe('Instance', function(){
        it('should raise error when nothing is populated', function(){
            assert.throws(function () {
                var composer = new Composer ();
            }, Error);
        });
        it('should raise error when uncorrect is populated', function(){
            assert.throws(function () {
                var composer = new Composer ('s');
            }, Error);
        });
        it('should raise error when nothing is populated', function(){
            var composer = new Composer ('test/data/packages.json');
            composer.less(function (less) {
                "use strict";
                assert.deepEqual(less, 'string');
            });
        });
        it('should return string if object is populated', function(){
            var composer = new Composer ({
                "packages" : [ "less-border-mixins", "less-border-mixins" ]
            });
            composer.less(function (less) {
                "use strict";
                assert.deepEqual(less, 'string');
            });
        });
    });
});