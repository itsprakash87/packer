const Module = require("./Module");
const path = require("path");
const Package = require("./Package");

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
                // require("./Utils").logModule(entryModule);
                let k = await this.createPackageTree(entryModule);
                require("./Utils").logPackage(k);
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

    createPackageTree(mod, parent, pkg) {
        let isEntryPoint = !pkg;

        if (isEntryPoint) {
            pkg = new Package(mod, null, null);
        }

        for(let dep of mod.depsModules) {
            let depInfo = mod.deps[dep.name];

            console.log("dep of ", mod.name, " => ", depInfo)

            if (dep.package) {
                // If this dependecy is already included in some package then move it to common ancestor of both packages.
                this.moveToCommonPackage(pkg, dep.package, dep);
            }
            else if (depInfo && depInfo.isDynamic) {
                // If this dependecy is dynamically loaded then create a new child package.
                let childPackage = pkg.createChildPackage(dep);
                this.createPackageTree(dep, mod, childPackage);
            }
            else if (depInfo) {
                let sibPackage = pkg.getSiblingPackageForModule(dep);

                sibPackage.addModule(dep)
                this.createPackageTree(dep, mod, sibPackage);
            }
        }
        return pkg;
    }

    moveToCommonPackage(pkg, depPackage, mod) {
        let commonAncestor = pkg.getCommonAncestor(depPackage);

        if (commonAncestor) {
            // Remove the module from both packages and move to common ancestor.
            pkg.removeModule(mod);
            depPackage.removeModule(mod);
            commonAncestor.addModule(mod);
        }
    }

    createPackages() {
        return;
    }

};

module.exports = Packer;
