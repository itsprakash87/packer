const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const utils = require("../Utils");

const copyFile = promisify(fs.copyFile);

class RAWPackager {

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

module.exports = RAWPackager;