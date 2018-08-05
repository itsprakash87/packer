import Module from "./Module";

class Packer {

    constructor(entryFiles, options = {}) {
        this.options = options;
        this.entryFiles = [...entryFiles];
        this.entryModules = new Set();
        this.modules = {};

        this.createModulesForEntryFiles();
    }

    getModule(moduleName) {
        if (this.modules[moduleName]) {
            return this.modules[moduleName];
        }

        return Module(moduleName, this.options);
    }

    createModulesForEntryFiles() {
        for (let entryFile of this.entryFiles) {
            let entryModule = this.getModule(entryFile);

            this.entryModules.add(entryModule);
        }
    }

    async pack() {
        for (let entryModule of this.entryModules) {
            await this.createDependencyTree(entryModule);
            await this.createPackageTree();
            await this.createPackages();
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

export default Packer;
