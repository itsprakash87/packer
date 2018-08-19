const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const utils = require("../Utils");

const copyFile = promisify(fs.copyFile);

class CSSPackager {

    constructor(pkg, options = {}) {
        this.package = pkg;
        this.options = options;
    }

    async packup() {
        let modules = (this.package && this.package.modules) || [];

        for (let mod of modules) {
            let modName = (mod && mod.name) || "";
            let ext = path.extname(modName) || "";
            let fileName = path.basename(modName, ext);
            let fileHash = await utils.getHashOfFile(modName, 5);
            let finalFileName = `${fileName}.${fileHash}${ext}`;

            await this.spitFile(modName, finalFileName);
        }
    }

    async spitFile(sourcePath, destFileName) {
        let outDir = this.options && this.options.outDir;
        let destPath = path.resolve(outDir, destFileName);

        await copyFile(sourcePath, destPath);
    }
}

module.exports = CSSPackager;