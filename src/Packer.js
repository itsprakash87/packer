const Module = require("./Module");
const path = require("path");
const Package = require("./Package");
const Packager = require("./Packager/Packager");
const util = require("./Utils");
const logger = require("./Logger")

class Packer {

    constructor(entryFiles, options = {}) {
        this.options = this.prepareOptions(options);
        this.entryFiles = [...entryFiles];
        this.entryModules = new Set();
        this.modules = {};

        this.createModulesForEntryFiles();
    }

    prepareOptions(options = {}) {
        options.babelrc = options.babelrc || path.resolve(__dirname ,"./.babelrc");
        options.outDir = options.outDir;
        options.publicPath = options.publicPath || "/";
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
                let pkg = await this.createPackageTree(entryModule);
                await this.createPackages(pkg);
                logger.log(`Successfully created the bundles in ${this.options.outDir}`);
            }
        }
        catch(err) {
            logger.persistError(err);
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

        logger.log(`Packaging ${mod.baseName}`);
        for(let dep of mod.depsModules) {
            let depInfo = mod.deps[dep.name];

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
            let sibPackage;
            // Remove the module from both packages and move to common ancestor.
            sibPackage = pkg.getSiblingPackageForModule(mod);
            sibPackage && sibPackage.removeModule(mod);

            sibPackage = depPackage.getSiblingPackageForModule(mod);
            sibPackage && sibPackage.removeModule(mod);

            sibPackage = commonAncestor.getSiblingPackageForModule(mod);
            sibPackage && sibPackage.addModule(mod);
        }
    }

    async createPackages(pkg) {
        // Make sure the outDir exitst.
        await util.createDirectoryIfNotExits(this.options.outDir);

        let pkgr = new Packager(pkg, this.options);

        await pkgr.packup();
    }

};

module.exports = Packer;
