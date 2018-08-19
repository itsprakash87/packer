const md5File = require("md5-file/promise");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const util = require("../Utils");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class JSPackager {

    constructor(pkg, options = {}) {
        this.package = pkg;
        this.options = options;
        this.outFile = "";
        this.addedNonJsModules = {};
    }

    async packup() {
        let modules = (this.package && this.package.modules) || [];

        this.outFile = await readFile(path.resolve(__dirname,"./JsBootstrap.js"));

        for (let mod of modules) {
            let name = util.getHashOfString(mod.name, 5);
            let modu = `function(require, module, exports){\n${mod.transformedContent}\n}`
            let deps = {};

            let depsNames = Object.keys(mod.deps);

            for (let dep of depsNames) {
                let dpHash = util.getHashOfString(dep, 5)
                let dpVal = mod.deps[dep].value;

                deps[dpVal] = dpHash;

                if (path.extname(dep) !== ".js") {
                    // If dependency is nonjs.
                    await this.addNonJsModuleInfo(dpHash, dep);
                }
            }

            deps = JSON.stringify(deps);
            this.addModuleInfo(name, modu, deps);
        }

        let modName = (this.package && this.package.entryModule && this.package.entryModule.name) || "";
        let ext = path.extname(modName) || "";
        let fileName = path.basename(modName, ext);
        let fileHash = util.getHashOfString(this.outFile, 5);
        let finalFileName = `${fileName}.${fileHash}${ext}`;

        this.outFile += `\n ], "${util.getHashOfString(modName, 5)}") \n )`;

        await this.spitFile(finalFileName);
    }

    async spitFile(destFileName) {
        let outDir = this.options && this.options.outDir;
        let destPath = path.resolve(outDir, destFileName);
        
        await writeFile(destPath, this.outFile);
    }

    addModuleInfo(name, modu, deps) {
        this.outFile += `{\n name: "${name}", \n module: ${modu}, \n deps: ${deps} \n},`;
    }

    async addNonJsModuleInfo(name, modulePath) {
        if (this.addedNonJsModules[name]) {
            return;
        }
        let ext = path.extname(modulePath) || "";
        let fileName = path.basename(modulePath, ext);
        let fileHash = await util.getHashOfFile(modulePath, 5);
        let finalFileName = `${fileName}.${fileHash}${ext}`;
        let finalFilePath = path.join(this.options.publicPath, finalFileName);

        let moduContent = `function(require, module, exports){\n module.exports = "${finalFilePath}"\n}`

        this.addModuleInfo(name, moduContent, "{}");
        this.addedNonJsModules[name] = true;
    }
}

module.exports = JSPackager;