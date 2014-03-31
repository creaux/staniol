var staniol = {},
    bower = require('bower'),
    wait = require('wait.for'),
    EventEmitter = require('events').EventEmitter,
    fs = require('fs'),
    path = require('path');

if (staniol !== undefined) {
    staniol = exports;
}

/**
 * Wrapper for bower applivation
 * @constructor
 */
staniol.Bower = function () {
    "use strict";

    var commands = bower.commands,
        bundle = arguments[0] || undefined,
        config = arguments[1] || {},
        directory = arguments[2] || 'staniol_components',
        cwd;

    function dir() {
        var firstPath = directory.split(path.sep);
        if (firstPath[0] === '.') cwd = './';
        else if (firstPath[0].match(/\w+/)) cwd = '';
        else if (firstPath[0] === '') cwd = '/';
    }

    function isStaniol(callback) {
        commands.info(bundle).on('end', function(info) {
            var main = info.latest.main;
            var length = main.length;
            var state;
            if (main instanceof Array) {
                for (var i = 0; i < length; i++) {
                    state = (main[i] === 'staniol.json');
                    if (state === true) break;
                }
            } else {
                state = (main === 'staniol.json');
            }
            if (state === false) throw new Error('Package is not Staniol package.');
            else callback();
        });
    }

    function install(callback) {
        isStaniol(function() {
            dir();
            commands.install([bundle], config, { directory : directory, cwd : cwd})
                .on('end', function () {
                    callback();
                }
            );
        });
    }

    /**
     * Install bower packages to directory (initial is this ./bower_components)
     */
    this.install = function (callback) {
        install(callback);
    };
};