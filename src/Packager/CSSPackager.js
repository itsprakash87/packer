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

        await this.spitFile(modName, finalFileName);
    }

    async spitFile(sourcePath, destFileName) {
        let outDir = this.options && this.options.outDir;
        let destPath = path.resolve(outDir, destFileName);

        await writeFile(destPath, this.outFile);
    }
}

module.exports = CSSPackager;