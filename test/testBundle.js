var ProcessBundle = require('../staniol/bundle.js').bundle.Process;
var assert = require('assert');

describe('Bundle', function(){
    describe('Instance', function(){
        it('should create instance properly', function(){
            var bundle = new ProcessBundle('test/data/components/border/staniol.json');
        });
        it('should create instance properly', function(){
            assert.throws(function() {
                "use strict";
                var bundle = new ProcessBundle('s');
            }, Error);
        });
    });
});