var version;

desc('Get version of actual distribution.');
task('version', function (params) {
    var fs = require('fs');
    var config = __dirname + '/bower.json';

    fs.readFile(config, 'utf8', function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }

        data = JSON.parse(data);
        version = data.version;
        console.log(version);
    });
});

desc('Create folder for current distribution.');
task('')