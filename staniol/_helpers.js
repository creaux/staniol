var staniol = {};

if (staniol !== undefined) {
    staniol = exports;
}


// Constructor.
var Interface = function(name, members) {
    if(arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length
            + "arguments, but expected exactly 2.");
    }

    this.name = name;
    this.members = [];
    for(var i = 0, len = members.length; i < len; i++) {
        if(typeof members[i] !== 'string') {
            throw new Error("Interface constructor expects members names to be "
                + "passed in as a string.");
        }
        this.members.push(members[i]);
    }
};

// Static class method.
Interface.ensureImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
            arguments.length  + "arguments, but expected at least 2.");
    }
    for(var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if(interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments "
                + "two and above to be instances of Interface.");
        }

        for(var j = 0, membersLen = interface.members.length; j < membersLen; j++) {
            var member = interface.members[j];
            if(!object[member]) {
                throw new Error("Function Interface.ensureImplements: object "
                    + "does not implement the " + interface.name
                    + " interface. Member " + member + " was not found.");
            }
        }
    }
};

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
    },
    Interface : Interface
};