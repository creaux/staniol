#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2)),
   Composer = require('../composer.js').Composer;

var Messages = {
    withoutArguments : "" +
        "Don\'t bother me if you don\'t have arguments! \n" +
        "\n" +
        "Use this shit: \n" +
        "   install [package] \n"

}

switch(argv._[0]) {
    case 'install':
        var packages = [];
        for (var i = 1; i < argv._.length; i++) {
            packages.push(argv._[i]);
        }
        console.log(packages);
        var composer = new Composer({packages : packages});
        composer.install();
        break;
    default:
        console.log(Messages.withoutArguments);
}