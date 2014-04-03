var staniol = {},
    Process = require("./packages").packages.Process,
    path = require('path'),
    fs = require('fs'),
    Parser = require('lessmin').Parser,
    EventEmitter = require('events').EventEmitter,
    helper = require('./_helpers').Helper;

if (staniol !== undefined) {
    staniol = exports;
}

staniol.bundle = {};

var simple = new helper.Interface('template', ['_filepath', '_variablesArray']);

/**
 * Parsing package to string data and distributing also variables
 */
staniol.bundle.Bundle = function () {
    "use strict";

    // /////////////// //
    // Private members //
    // /////////////// //

    var file = arguments[0],
        bundle,
        variables,
        main,           // Name of bundle json file
        dirpath;        // Path to bundle

    /**
     * Get bundle data from configuration file
     */
    function parseFileJson() {
        var process = new Process(file);
        bundle = process.parse();
    }

    function setMain (setter) {
        main = setter;
    }

    function getMain () {
        return main;
    }

    function setDirpath (setter) {
        dirpath = setter;
    }

    function getDirpath () {
        return dirpath;
    }

    /**
     * Set variables
     */

    function setVariables (setter) {
        variables = setter;
    }
    function getVariables () {
        return variables;
    }

    // ////////////// //
    // Initialization //
    // ////////////// //
    parseFileJson(file);
    setDirpath(path.dirname(file));
    setMain(bundle.main);
    setVariables(bundle.variables);

    // ////////////////// //
    // Privileged members //
    // ////////////////// //
    this._filepath = path.join(getDirpath(), getMain());
    this._variablesArray = getVariables();
    this.bundlePathInComponents = path.join(getDirpath().split(path.sep).slice(-1)[0], getMain());

    // Ensure implement of interface
    helper.Interface.ensureImplements(this, simple);
};


staniol.bundle.Process = function () {
    "use strict";

    // /////////////// //
    // Private members //
    // /////////////// //

    var self = this,
        file = arguments[0] || undefined,
        data,
        variablesData = '';

    // Inheritance
    staniol.bundle.Process.superClass.constructor.call(self, file);

    function setVariablesData() {
        var vararray = self._variablesArray;
        for (var variable in vararray) {
            variablesData = variablesData.concat('@'+variable+': ' + vararray[variable]+";\r\n");
        }
    }

    function getVariablesData() {
        return variablesData;
    }

    // ////////////// //
    // Initialization //
    // ////////////// //

    setVariablesData();

    // ////////////////// //
    // Privileged members //
    // ////////////////// //

    /**
     * Return string of less code
     * @returns {string}
     */

    this.less = function () {
        var parser = new Parser();
        data = parser.parse({
            minimize : false,
            input : this._filepath
        });
        return data;
    };

    this.variables = function () {
        return getVariablesData();
    };
};

// Inheriting Bundle to Process
helper.extend(staniol.bundle.Process, staniol.bundle.Bundle);