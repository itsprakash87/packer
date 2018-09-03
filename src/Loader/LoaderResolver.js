const JSLoader = require("./JSLoader");
const CSSLoader = require("./CSSLoader");
const Loader = require("./Loader");

module.exports.getLoader = function (moduleType) {
    if (typeof moduleType === "string") {
        if (moduleType.endsWith("js")) {
            return JSLoader;
        }
        else if (moduleType.endsWith("css")) {
            return CSSLoader;
        }
        else {
            // If file type is not supported then return raw loader.
            return Loader;
        }
    }
    else {
        return Loader;
    }
};
