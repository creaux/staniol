var staniol = {},
    fs = require('fs'),
    helper = require('./_helpers').Helper,
    EventEmitter = require('events').EventEmitter;

if (staniol !== undefined) {
    staniol = exports;
}

staniol.packages = {};

// Declaration of simple Interface
var simple = new helper.Interface('template', ['packages']);
var multiple = new helper.Interface('template', ['packages']);

// Simple interface template
staniol.packages.simple = {
    packages : Array
};

/**
 * Package setting
 */
staniol.packages.Packages = function () {
    "use strict";

    // /////////////// //
    // Private members //
    // /////////////// //

    var data = arguments[0];

    // ////////////////// //
    // Privileged members //
    // ////////////////// //
    this.packages = data;

    // Ensure implement of interface
    helper.Interface.ensureImplements(this, simple);
};

/**
 * Subclass of staniol.setting.Packages Class
 * Extending it with solution of parse file and processing its data
 *
 * @param input
 * @returns {Function}
 * @constructor
 */
staniol.packages.Process = function() {
    "use strict";

    // /////////////// //
    // Private members //
    // /////////////// //

    var that = this,
        data,
        json,
        input = arguments[0];

    /**
     * Get config
     * @returns {*}
     * @param data
     */
    function setJson(data) {
        try { json = JSON.parse(data); }
        catch(e) { throw new Error('Unexpected token: '+ data + ', is not json.'); }
    }
    function getJson() { return json; }



    // ////////////////// //
    // Privileged members //
    // ////////////////// //

    this.parse = function() {
        return this.packages;
    };

    // ////////////// //
    // Initialization //
    // ////////////// //

    // Check it is a data or object (file vs. {}) else raise error
    if (fs.existsSync(input)) {
        data = fs.readFileSync(input, 'utf-8');
        setJson(data);
        data = getJson();
    }
    else if (typeof input === 'object') data = input;
    else throw new Error('Input format: ' + input + ' is not known.');

    // Inheritance
    staniol.packages.Process.superClass.constructor.call(that, data);
};

// Inheriting Packages to Process
helper.extend(staniol.packages.Process, staniol.packages.Packages);

