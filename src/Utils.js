module.exports.isNodeModule = function(modulePath) {
    if (typeof modulePath !== "string" || modulePath.startsWith(".") || modulePath.startsWith("/")) {
        return false;
    }
    return true;
}
