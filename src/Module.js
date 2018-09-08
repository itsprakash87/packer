// Each file is represented by Module class. 
// Contain information about file.
// Also does all kind of operation on file like transformationn, parsing, creating dependency tree etc.
const { getLoader } = require("./Loader/LoaderResolver");
const { promisify } = require("util");
const fs = require("fs");
const logger = require("./Logger");
const path = require("path");
const util = require("./Utils");

const readFile = promisify(fs.readFile);
// Single file should have single module object.
// If same file comes multiple time then return the same Module object.
// This const keeps track of that.
const moduleCache = {};

class Module {

    constructor(moduleName, options = {}) {
        // TODO: Use factory pattern to create Module instances.
        if (moduleCache[moduleName]) {
            return moduleCache[moduleName];
        }

        this.name = moduleName;
        this.options = options;
        this.baseName = path.basename(moduleName);
        this.type = path.extname(moduleName).substring(1);;
        this.hash;
        this.deps;
        this.depsModules;
        this.depTreeCreated = false;
        this.parentModules = new Set();
        this.pretransformedContent;
        this.transformedContent;
        this.package;

        this.loader = getLoader(this.type);
        this.loader = new this.loader("", this.name, this.options);

        moduleCache[moduleName] = this;
    }

    async readModule() {
        this.pretransformedContent = await readFile(this.name, "utf8");
        this.loader.pretransformedContent = this.pretransformedContent;
    }

    async createDependencyTree() {
        if (this.depTreeCreated) {
            return;
        }

        if (!this.pretransformedContent) {
            await this.readModule();
        }
        logger.log(`Building ${this.baseName}`);
        let deps = await this.loader.getDependencies();
        this.depsModules = new Set();
        this.deps = {};
        
        if (!this.transformedContent) {
            this.transformedContent = await this.loader.transform();
        }

        deps = this.resolveDependencyPath(deps);

        this.depTreeCreated = true;

        for (let dep of deps) {
            // dep = { name: "/home/abc/proj/a.js", value: "../a", isDynamic: true}
            this.deps[dep.name] = dep;

            let depModule = new Module(dep.name, this.options);
            this.depsModules.add(depModule);
            await depModule.createDependencyTree();
        }

        return;
    }

    resolveDependencyPath(deps = []) {
        let uniqueDeps = {};

        for (let dep of deps) {
            let name;

            if (util.isNodeModule(dep.value)) {
                if (util.isNodeCoreModule(dep.value) || util.isPackerCustomModule(dep.value)) {
                    name = util.resolveNodeCoreModule(dep.value)
                }
                else {
                    name = require.resolve(dep.value, { paths: [this.name] });
                }
            }
            else {
                name = path.resolve(path.dirname(this.name), dep.value);
                name = require.resolve(name);
            }

            if (!uniqueDeps[name] || (uniqueDeps[name].type === "DynamicImportDeclaration" && dep.type !== "DynamicImportDeclaration")) {
                // If same dependency is loaded in module, dynamically and non dynamically, then we prefer non dynamic dependency.
                uniqueDeps[name] = Object.assign({}, dep, { name: name, isDynamic: dep.type === "DynamicImportDeclaration" });
            }
        }

        return Object.values(uniqueDeps);
    }
};

module.exports = Module;
