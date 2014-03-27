var staniol = {},
    fs = require('fs'),
    helper = require('./_helpers').Helper,
    EventEmitter = require('events').EventEmitter;

if (staniol !== undefined) {
    staniol = exports;
}

staniol.packages = {};

/**
 * Package setting
 */
staniol.packages.Setting = function (jsonFile) {
    "use strict";
    var configFile,
        config,
        main = null,
        variables = {};

    /**
     * Set config file
     * @param setConfigFile
     */

    function setConfigFile(sConfigFile) {
        configFile = sConfigFile;
    }

    function getConfigFile() {
        return configFile;
    }

    /**
     * Set variables of package
     */
    function setVariables(sVariables) {
        variables = sVariables;
    }

    function getVariables() {
        return variables;
    }

    /**
     * Set main file
     */
    function setMain(sMain) {
        if (setMain !== undefined) { main = sMain; }
    }

    function getMain() {
        return main;
    }

    /**
     * Get config
     * @returns {*}
     * @param setConfig
     */
    function setSetting(sConfig) {
        try { config = JSON.parse(sConfig); }
        catch(e) { throw Error('Error: File '+ sConfig + ' is not json.'); }
    }

    function getSetting() {
        return config;
    }

    function verifySetting () { // TODO: Verify that setting file contain same model as template
    }

    function init(f) {
        setConfigFile(f);
        configFile = getConfigFile();
        setSetting(configFile);
        config = getSetting();
    }

    init(jsonFile);

    //TODO: Check type of config and parse

    this.Config = config;
    return config;
};

/**
 * Subclass of staniol.setting.Setting Class
 * Extending it with solution of parse file and processing its data
 *
 * @param filepath
 * @returns {Function}
 * @constructor
 */
staniol.packages.Process = function(filepath) {
    "use strict";

    var emitter = new EventEmitter(),
        that = this;

    fs.readFile(filepath, 'utf-8', function(err,d) {
        staniol.packages.Process.superClass.constructor.call(that, d);
        emitter.emit('onProcess');
    });

    this.parse = function(callback) {
        emitter.on('onProcess', function() {
            callback(that.Config);
        });
    };
};

// Inheriting Setting to Process
helper.extend(staniol.packages.Process, staniol.packages.Setting);

