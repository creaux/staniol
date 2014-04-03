var staniol = {},
    path = require('path'),
    fs = require('fs'),
    Bower = require('./_bower').Bower,
    EventEmitter = require('events').EventEmitter,
    ProcessBundle = require('./bundle').bundle.Process;

if (staniol !== undefined) {
    staniol = exports;
}

staniol.install = {};

staniol.install.Bundle = function () {
    "use strict";

    if (arguments[0] === undefined) throw new Error('No argument is defined please provide option.');

    var options = arguments[0] || undefined,
        bundle = options.bundle || undefined,
        config = options.config || undefined,
        directory = options.directory || 'staniol_components',
        type = options.type || 'bower';

    // /////////////// //
    // Private members //
    // /////////////// //

    /**
     * Install with Bower
     */
    function installBower(onInstall) {
        var bower = new Bower (bundle, config, directory);
        bower.install (function() {
            console.log('Package: ' + bundle + ' has been installed to new location: ' + directory);
            if (typeof onInstall === "function") onInstall();
        });
    }

    //TODO: Install from local path

    // ////////////////// //
    // Privileged members //
    // ////////////////// //

    /**
     * Install bundle to specific location
     * @param onInstall
     */
    this.install = function (onInstall) {
        if (type === 'bower') installBower(onInstall);
        // TODO: Install via file system
    };
};

staniol.install.Components = function () {
    "use strict";

    var options = arguments[0] || undefined,
        components = options.components || undefined,
        config = options.config || undefined,
        directory = options.directory || 'staniol_components';

    //TODO: Components
    var variablesFile = path.join(directory, 'variables.less'),
        importerFile = path.join(directory, 'importer.less');

    var emitter = new EventEmitter();


    function makeImporter (data) {
        fs.appendFile(importerFile, data, function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
    }

    function makeVariablesFile (data) {
        fs.appendFile(variablesFile, data, function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
    }

    this.install = function () {
        var less, variables;
        this.prepare(function (bundle) {
            less = bundle.less();
            variables = bundle.variables();
            makeVariablesFile(variables);
            makeImporter("@import \"" + bundle.bundlePathInComponents + "\";\n"); // TODO: Name of bundle is saved in bundle object !!!
        });
    };

    this.prepare = function (callback) {
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            var bundle = new staniol.install.Bundle({
                bundle : component,
                config : config,
                directory : directory,
                type : 'bower'
            });
            bundle.install(function() {
                var bundle = new ProcessBundle ( path.join( directory, component, 'staniol.json' ) );
                callback(bundle);
            });
        }
    };

    this.process = function ( callback ) {
        for ( var key in components ) {
            var bundle = new ProcessBundle(components[key].path) ;
            callback(bundle);
        }
    };
};