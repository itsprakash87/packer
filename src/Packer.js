const Module = require("./Module");
const path = require("path");

class Packer {

    constructor(entryFiles, options = {}) {
        this.options = this.prepareOptions(options);
        // this.entryFiles = [...entryFiles];
        this.entryFiles = ["/home/prakash/packer/examples/temp/main.js"]
        this.entryModules = new Set();
        this.modules = {};

        this.createModulesForEntryFiles();
    }

    prepareOptions(options = {}) {
        options.babelrc = options.babelrc || path.resolve(__dirname ,"./.babelrc");
        return options;
    }

    getModule(moduleName) {
        if (this.modules[moduleName]) {
            return this.modules[moduleName];
        }

        return new Module(moduleName, this.options);
    }

    createModulesForEntryFiles() {
        for (let entryFile of this.entryFiles) {
            let entryModule = this.getModule(entryFile);

            this.entryModules.add(entryModule);
        }
    }

    async pack() {
        try {
            for (let entryModule of this.entryModules) {
                await this.createDependencyTree(entryModule);
                require("./Utils").logModule(entryModule);
                await this.createPackageTree();
                await this.createPackages();
            }
        }
        catch(err) {
            console.error(err)
        }
    }

    async createDependencyTree(entryModule) {
        await entryModule.createDependencyTree();
    }

    createPackageTree() {
        return;
    }

    createPackages() {
        return;
    }

};

module.exports = Packer;
