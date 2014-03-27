var staniol = {};

if (staniol !== undefined) {
    staniol = exports;
}

staniol.Helper = {
    extend : function (subClass, superClass) {
        "use strict";
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        subClass.superClass = superClass.prototype;
        if(superClass.prototype.constructor === Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
    }
};