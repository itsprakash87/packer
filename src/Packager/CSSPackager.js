const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const utils = require("../Utils");

const writeFile = promisify(fs.writeFile);

class CSSPackager {

    constructor(pkg, options = {}) {
        this.package = pkg;
        this.options = options;
        this.outFile = "";
    }

    async packup() {
        let modules = (this.package && this.package.modules) || [];

        for (let mod of modules) {
            this.outFile += `${mod.transformedContent}\n\n`;
        }

        let modName = (this.package && this.package.entryModule && this.package.entryModule.name) || "";
        let ext = path.extname(modName) || "";
        let fileName = path.basename(modName, ext);
        let fileHash = utils.getHashOfString(this.outFile, 5);
        let finalFileName = `${fileName}.${fileHash}${ext}`;

        this.addBundleUrl(modName, finalFileName);
        await this.spitFile(modName, finalFileName);
    }

    async spitFile(sourcePath, destFileName) {
        let outDir = this.options && this.options.outDir;
        let destPath = path.resolve(outDir, destFileName);

        await writeFile(destPath, this.outFile);
    }

    addBundleUrl(modName, finalFileName) {
        // Add url of this output bundle to package object.
        // If this package is a child package of any parent package then this url can be used to lazily load this package in parent package.
        modName = utils.getHashOfString(modName, 5);
        modName = `${modName}_url`;

        this.package.bundleUrls.push({
            name: modName,
            url: path.join(this.options.publicPath, finalFileName)
        })
    }
}

module.exports = CSSPackager;