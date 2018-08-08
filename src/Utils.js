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
        return require.resolve("./Module/emptyModule")
    }
    else {
        return nodeCoreForBrowser[val];
    }
}
