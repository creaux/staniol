var staniol
    , fs = require('fs')
    , path = require('path')
    , Data = require('./data').Data
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
        emitter = new EventEmitter();

    /**
     * Setter for packages variable
     * @param sPackages
     * @callback onParsed
     */
    function parseJSON () {
        var file = packagesfile;
        fs.exists (file, function(bool) {
            if (!bool) throw Error ('Package file: ' + file + ' is not exist.');
            var process = new Process (file);
            process.parse (function (packages) {
                packages = packages.packages;
                emitter.emit('parse', packages);
            });
        });
    }

    /**
     * This method processing a serving data to onLessData
     * @callback onLessData
     */
    function onParsed () { //TODO: Control flow
        emitter.on('parse', function (packages) {
            if ( packages instanceof Array ) {
                emitter.emit('bower', packages);
            } else {
                emitter.emit('file', packages);
            }
        });
    }


    function onLess(onLessData) {
        emitter.on('lessGet', function (dataobj) {
            dataobj.less( function ( data ) {
                onLessData ( data );
            });
        });
    }

    function onVariables () {
        emitter.on('lessGet', function (dataobj, pack) {
            var variables = dataobj.variables();
            emitter.emit('variablesGet', variables);
        });
    }

    /**
     * Provide callback on less data
     * @callback onLessData
     */
    function onData() {
        emitter.on('bower', function (pack) {
                temp.mkdir('staniol_components', function ( err, tempDir ) {
                    for (var i = 0; i < pack.length; i++) {
                        var bundle = pack[i];
                        var install = new Install({
                            bundle : bundle,
                            config : undefined,
                            directory : tempDir,
                            type : 'bower'
                        });
                        install.install(function() {
                            var dataobj = new Data ( path.join( tempDir, bundle, 'staniol.json' ) );
                            emitter.emit('lessGet', dataobj);
                        });
                    }
                });
        }).on('file', function (pack) {
            for ( var key in pack ) {
                var dataobj = new Data(pack[key].path);
                emitter.emit('lessGet', dataobj);
            }
        });
    }

    function init() {
        parseJSON();
        onParsed();
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
        onVariables();
        emitter.on('variablesGet', function (variables) {

        });
    };

    init();
};