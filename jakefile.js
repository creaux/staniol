
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

    Build.Dir.loader = path.join(Build.Dir.path, 'loader', 'staniol.less');

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

        Dist.Dir.version = path.join(Dist.Dir.path, "v" + Staniol.Data.version.toString());
        Dist.Dir.components = path.join(Dist.Dir.version, Staniol.Dir.components);
        Dist.Dir.core = path.join(Dist.Dir.version, Staniol.Dir.core);

        Dist.Data.variables = '';
        Dist.File.components = path.join(Dist.Dir.version, 'components.less');
        Dist.File.variables = path.join(Dist.Dir.version, 'variables.less');

        jake.mkdirP(Dist.Dir.version);
        jake.cpR(Build.Dir.components, Dist.Dir.components);
        jake.cpR(Build.Dir.core, Dist.Dir.core);
        jake.cpR(Build.Dir.loader, Dist.Dir.version);

        /**
         * Creating dist/{version}/components/init.less
         */
        fs.readdir('build/components', function(err, data) {
            if (err) throw err;
            var componentsInitFileContent = '';
            for (var i = 0; i <= data.length; i++) {
                componentsInitFileContent = componentsInitFileContent.concat('@import '+'"'+data[i]+'/init.less"'+";\r\n");
            }
            fs.writeFile('dist/v'+Staniol.Data.version+'/components/init.less', componentsInitFileContent, function(err) { if(err) { console.log(err); }});
        });

        fs.readFile(Build.Dir.componentsConfig, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }

            data = JSON.parse(data);

            for (var component in data) {
                if (typeof data[component] === "boolean") {
                    var bool = component;
                    if (bool) Dist.Data.components = Dist.Data.components.concat('@'+component+': '+data[component]+";\r\n");
                } else {
                    if (data[component]['value']) {
                        for (var variable in data[component]['variables']) {
                            Dist.Data.components =
                                Dist.Data.components.concat('@'+variable+': '+data[component]['variables'][variable]+";\r\n");
                        }
                    }
                }
            }

            fs.writeFile(Dist.File.components, Dist.Data.components, function(err) { if(err) { console.log(err); }});
        });

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
    });


});