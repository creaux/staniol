var staniol
    , fs = require('fs')
    , path = require('path')
    , Process = require('./packages').packages.Process
    , temp = require('temp')
    , temporary = require('temporary')
    , helper = require('./_helpers').Helper
    , EventEmitter = require('events').EventEmitter
    , Install = require('./install').install.Bundle
    , Components = require('./install').install.Components;

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
        if ( packages instanceof Array ) {
                temp.mkdir('staniol_components', function ( err, tempDir ) {
                    var components = new Components({
                            components : packages,
                            directory : tempDir
                    });
                    components.prepare(function (bundle) {
                        emitter.emit('lessGet', bundle);
                    });
                });
        } else {
            var components = new Components({
                components : packages
            });
            components.process(function (bundle) {
                emitter.emit('lessGet', bundle);
            });
        }
    }

    // ////////////////// //
    // Privileged members //
    // ////////////////// //

    /**
     * Install package to defined folder
     */
    this.install = function () {
        packages = packages || undefined;
        var components = new Components({
            components : packages
        });
        components.install();
    };

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

    this.variables = function () {
        onData();
        onVariables();
        emitter.on('variablesGet', function (variables) {
            // TODO: onVariables
            console.log(variables);
        });
    };

    // Initialization
    parseJSON();
};