// Each file is represented by Module class. 
// Contain information about file.
// Also does all kind of operation on file like transformationn, parsing, creating dependency tree etc.
import { getLoader } from "./Loader/LoaderResolver";
import { promisify } from "util";
import fs from "fs";

const readFile = promisify(fs.readFile);
// Single file should have single module object.
// If same file comes multiple time then return the same Module object.
// This variable keeps track of that.
const moduleCache = {};

class Module {

    constructor(moduleName, options = {}) {
        // TODO: Use factory pattern to create Module instances.
        if (moduleCache[moduleName]) {
            return moduleCache[moduleName];
        }

        this.name = moduleName;
        this.options = options;
        this.baseName;
        this.type;
        this.hash;
        this.deps;
        this.depsModules;
        this.depTreeCreated = false;
        this.parentModules = new Set();
        this.pretransformedContent;
        this.transformedContent;

        this.loader = getLoader(this.type);
        this.loader = new this.loader();

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

        let deps = await this.loader.getDependencies();
        this.depsModules = new Set();

        for(let dep of deps){
            // dep = { name: "/home/abc/proj/a.js", value: "../a", isDynamic: true}
            this.deps[dep.name] = dep;

            let depModule = new Module(dep.name, this.options);
            this.depsModules.add(depModule);
            await depModule.createDependencyTree();
        }

        this.depTreeCreated = true;
        return;
    }

};

export default Module;