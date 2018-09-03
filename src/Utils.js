const nodeCoreForBrowser = require("node-libs-browser")
const { promisify } = require("util");
const fs = require("fs");
const crypto = require('crypto');
const md5File = require("md5-file/promise");
const md5FileSync = require("md5-file").sync;

const dirExist = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const FILE_HASH_CACHE = {};

const PACKER_CUSTOM_MODULES = {
    "_dynamic_loader": require.resolve("./Loader/_dynamic_loader"),
};

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

module.exports.isPackerCustomModule = function (val) {
    return !!PACKER_CUSTOM_MODULES[val];
}

module.exports.resolveNodeCoreModule = function (val) {
    if (nodeCoreForBrowser[val] === null) {
        return require.resolve("./emptyModule")
    }
    else if (PACKER_CUSTOM_MODULES[val]) {
        return PACKER_CUSTOM_MODULES[val];
    }
    else {
        return nodeCoreForBrowser[val];
    }
}

module.exports.createDirectoryIfNotExits = async function(dirPath) {
    if (!await dirExist(dirPath)) {
        await mkdir(dirPath);
    }
}

module.exports.getHashOfString = function(str, charCount) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    var hash = md5sum.digest('hex');
    if (charCount > 0) {
        hash = hash.substr(0, charCount);
    }
    return hash;
}

module.exports.getHashOfFile = async function(modName, charCount) {
    if (FILE_HASH_CACHE[modName]) {
        return FILE_HASH_CACHE[modName];
    }

    let hash = await md5File(modName);

    if (charCount > 0) {
        hash = hash.substr(0, charCount);
    }

    FILE_HASH_CACHE[modName] = hash;
    return hash;
}

module.exports.getHashOfFileSync = function(modName, charCount) {
    if (FILE_HASH_CACHE[modName]) {
        return FILE_HASH_CACHE[modName];
    }

    let hash = md5FileSync(modName);

    if (charCount > 0) {
        hash = hash.substr(0, charCount);
    }

    FILE_HASH_CACHE[modName] = hash;
    return hash;
}
