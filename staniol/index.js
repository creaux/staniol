var staniol = {
    Parser : require('./composer').Composer
};

for (var k in staniol) { if (staniol.hasOwnProperty(k)) { exports[k] = staniol[k]; }}

