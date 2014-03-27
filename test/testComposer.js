var Composer = require('../staniol/composer.js').Composer;

//exports.module = {
//    setUp: function () {
//        this.composer = new Composer ( 'test/data/packages.json' );
//    },
//    tearDown: function () {
//        // clean up
//    },
//    testLessString: function (test) {
//        this.composer.less(function (less) {
//            console.log(less);
//        });
//    }
//};

var composer = new Composer ( 'test/data/packages.json' );
composer.less(function (less) { // Get string which is not minimized
    console.log(less);
});

var composer2 = new Composer ( 'test/data/packages.json' );
composer2.install(); // Install to default directory staniol_components