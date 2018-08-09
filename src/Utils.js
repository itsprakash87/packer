const nodeCoreForBrowser = require("node-libs-browser")

module.exports.isNodeModule = function (modulePath) {
    if (typeof modulePath !== "string" || modulePath.startsWith(".") || modulePath.startsWith("/")) {
        return false;
    }
    return true;
}

module.exports.isNodeCoreModule = function (val) {
    if (nodeCoreForBrowser[val] === null || nodeCoreForBrowser[val]) {
        return true;
    }
    return false;
}

module.exports.resolveNodeCoreModule = function (val) {
    if (nodeCoreForBrowser[val] === null) {
        return require.resolve("./emptyModule")
    }
    else {
        return nodeCoreForBrowser[val];
    }
}

module.exports.logPackage = function (mod) {
    var cache = [];
    require("fs").writeFileSync('/home/prakash/packer/logs.txt', JSON.stringify(mod, function(key, value){
        if (key === "modules" || key === "childPackages") {
            return Array.from(value)
        }
        if (key === "loader") {
            return null;
        }

        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return "circ";
                }
            }
            // Store value in our collection
            cache.push(value);
        }

        return value;
    }));
    cache = null;
}

module.exports.logModule = function (mod, space = 0) {
    var cache = [];
    require("fs").writeFileSync('/home/prakash/packer/logs.txt', JSON.stringify(mod, function(key, value){
        if (key === "depsModules") {
            return Array.from(value)
        }
        if (key === "loader") {
            return null;
        }

        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }

        return value;
    }));
    cache = null;
}
