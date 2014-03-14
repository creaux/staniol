
desc('Create and checks for dist folder.');
directory('dist');

desc('Get version of actual distribution.');
task('default', ['dist'], function () {
    var   fs = require('fs')
        , path = require('path')
        , Staniol = {}
        , Build = {}
        , Dist = {}
        , name
        , variables
        , components;

    Staniol.Dir = {};
    Staniol.Data = {};
    Staniol.Dir.components = 'components';
    Staniol.Dir.core = 'core';
    Staniol.Dir.config = __dirname + '/staniol.json';
    Staniol.Dir.componentsFile = 'components.json';
    Staniol.Dir.variablesFile = 'variables.json';

    Build.Dir = {};
    Build.Components = {};
    Build.Dir.path =  'build';
    Build.Dir.components = path.join(Build.Dir.path, Staniol.Dir.components);
    Build.Dir.core = path.join(Build.Dir.path, Staniol.Dir.core);

    Build.Dir.componentsConfig = path.join(Build.Dir.path, Staniol.Dir.componentsFile);
    Build.Dir.variablesConfig = path.join(Build.Dir.path, Staniol.Dir.variablesFile);

    Build.Dir.loader = path.join(Build.Dir.path, 'staniol.json');

    Dist.Dir = {};
    Dist.File = {};
    Dist.Data = {};
    Dist.Dir.path = 'dist';
    Dist.Data.components = '';

    fs.readFile(Staniol.Dir.config, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }

        data = JSON.parse(data);
        name = data.name;

        Staniol.Data.version = data.version;
        Staniol.Data.variables = data.variables;
        Staniol.Data.components = data.components;
        Staniol.Data.version = data.version;

        Dist.Dir.components = path.join(Dist.Dir.path, Staniol.Dir.components);
        Dist.Dir.core = path.join(Dist.Dir.path, Staniol.Dir.core);

        Dist.Data.variables = '';
        Dist.File.components = path.join(Dist.Dir.path, 'components.less');
        Dist.File.variables = path.join(Dist.Dir.path, 'variables.less');

        jake.mkdirP(Dist.Dir.path);
        //jake.cpR(Build.Dir.components, Dist.Dir.components);
        jake.cpR(Build.Dir.core, Dist.Dir.core);
        jake.mkdirP('dist/components'); //TODO: Vars

        //jake.cpR(Build.Dir.loader, Dist.Dir.path);

        /**
         * Creating dist/{version}/components/init.less
         */
        fs.readdir('build/components', function(err, data) {
            if (err) throw err;
            var componentsInitFileContent = '';
            for (var i = 0; i < data.length; i++) {
                componentsInitFileContent = componentsInitFileContent.concat('@import '+'"'+data[i]+'/init.less"'+";\r\n");
            }
            fs.writeFile('dist/components/init.less', componentsInitFileContent, function(err) { if(err) { console.log(err); }});
        });

        // components.less & select good components
        fs.readFile(Build.Dir.componentsConfig, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            data = JSON.parse(data);

            // Check if component exists
            for (var component in data) {
                // Select and copy appropriate component
                var buildPath = path.join(Build.Dir.components, component);
                var distPath = path.join(Dist.Dir.components, component);
                if (typeof data[component] === "boolean" && data[component] == true) jake.cpR(buildPath, distPath);
                // components.less
                if (typeof data[component]['value'] === "boolean" && data[component]['value'] == true) {
                    // Select and copy appropriate component (component which have variables)
                    jake.cpR(buildPath, distPath);

                    for (var variable in data[component]['variables']) {
                        Dist.Data.components =
                            Dist.Data.components.concat('@'+variable+': '+data[component]['variables'][variable]+";\r\n");
                    }
                }
            }

            fs.writeFile(Dist.File.components, Dist.Data.components, function(err) { if(err) { console.log(err); }});
        });

        // variables.less
        fs.readFile(Build.Dir.variablesConfig, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            data = JSON.parse(data);

            for (var variable in data) {
                Dist.Data.variables = Dist.Data.variables.concat('@'+variable+': '+data[variable]+";\r\n");
            }

            fs.writeFile(Dist.File.variables, Dist.Data.variables, function(err) { if(err) { console.log(err); }});
        });

        // staniol.less
        fs.readFile(Build.Dir.loader, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err );
            }

            data = JSON.parse(data);
            var path = require('path');

            Dist.File.loader = path.join(Dist.Dir.path, 'loader.less');
            Dist.Data.loader = '';

            for (var loader in data) {
                Dist.Data.loader = Dist.Data.loader.concat('@import "' + data[loader] + '";');
            }

            fs.writeFile(Dist.File.loader, Dist.Data.loader, function(err) { if(err) { console.log(err); }});
        });
    });
});

desc('Create and checks for min folder.');
directory('min');

desc('Get version of actual distribution.');
task('minimal', ['min'], function () {

    var fs = require('fs')
      , Parser = require('lessmin').Parser
      , parser = new Parser();

    parser.parse({
        minimize : true,
        input : 'dist/loader.less',
        callback : function(data) {
            fs.writeFile('min/staniol.min.less', data, function(err) { if(err) { console.log(err); }})
        }
    });
});