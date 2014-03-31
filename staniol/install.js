var staniol = {},
    path = require('path'),
    fs = require('fs'),
    Bower = require('./_bower').Bower;

if (staniol !== undefined) {
    staniol = exports;
}

staniol.Install = function () {
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
            console.log('Package: ' + bundle + ' has been installed');
            if (typeof onInstall === "function") onInstall();
        });
    }

    //TODO: Install from local path

    // ////////////////// //
    // Privileged members //
    // ////////////////// //

    this.install = function (onInstall) {
        if (type === 'bower') installBower(onInstall);
    };
};