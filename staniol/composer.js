var staniol
    , fs = require('fs')
    , path = require('path')
    , ProcessBundle = require('./bundle').bundle.Process
    , Process = require('./packages').packages.Process
    , temp = require('temp')
    , temporary = require('temporary')
    , helper = require('./_helpers').Helper
    , EventEmitter = require('events').EventEmitter
    , Install = require('./install').Install;

if (staniol === undefined) {
    staniol = exports;
}

/**
 * Composer is main package which integrating whole Staniol application
 * @constructor
 */
staniol.Composer = function () {
    "use strict";

    // Private members

    var packagesfile = arguments[0] || undefined, // List of packages in json file
        packages,
        minify = false,
        emitter = new EventEmitter();

    /**
     * Setter for packages variable
     * @param sPackages
     * @callback onParsed
     */
    function parseJSON () {
        var process = new Process (packagesfile);
        packages = process.parse ();
        packages = packages.packages;
    }

    function onLess(onLessData) {
        emitter.on('lessGet', function (bundle) {
            var data = bundle.less();
            onLessData ( data );
        });
    }

    function onVariables () {
        emitter.on('lessGet', function (bundle) {
            var variables = bundle.variables();
            emitter.emit('variablesGet', variables);
        });
    }

    /**
     * Provide callback on less data
     * @callback onLessData
     */
    function onData() {
        var pack = packages;
        if ( packages instanceof Array ) {
                temp.mkdir('staniol_components', function ( err, tempDir ) {
                    for (var i = 0; i < pack.length; i++) {
                        var bundleName = pack[i];
                        var install = new Install({
                            bundle : bundleName,
                            config : undefined,
                            directory : tempDir,
                            type : 'bower'
                        });
                        install.install(function() {
                            var bundle = new ProcessBundle ( path.join( tempDir, bundleName, 'staniol.json' ) );
                            emitter.emit('lessGet', bundle);
                        });
                    }
                });
        } else {
            for ( var key in pack ) {
                var bundle = new ProcessBundle(pack[key].path);
                emitter.emit('lessGet', bundle);
            }
        }
    }

    // ////////////////// //
    // Privileged members //
    // ////////////////// //

    /**
     * Method serving data to the callback as argument
     * @param onLessData - The callback that handles string data that have been parsed from tree of files.
     */
    this.less = function (onCode) {
        onData();
        onLess(function(code) {
            onCode(code);
        });
    };

    /**
     * Install package to defined folder
     */
    this.install = function () {
        var directory = arguments[0] || undefined;

        emitter.on('parse', function (packages) {
            packages = packages || undefined;
            for (var i = 0; i < packages.length; i++) {
                var bundle = packages[i];
                var install = new Install({
                    bundle : bundle,
                    config : undefined,
                    directory : directory,
                    type : 'bower'
                });
                install.install();
            }
        });
    };

    this.variables = function () {
        onData();
        onVariables();
        emitter.on('variablesGet', function (variables) {
            console.log(variables);
        });
    };

    // Initialization
    parseJSON();
};