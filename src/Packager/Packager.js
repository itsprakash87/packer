// Parent class for other packagers. Define the default function to be overridden by subclasses.
// It creates the final package file, add all the modules to that file, add prlude to packed file.

const JSPackager = require("./JSPackager")
const CSSPackager = require("./CSSPackager")
const RAWPackager = require("./RAWPackager");

class Packager {

    constructor(pkg, options = {}) {
        this.package = pkg;
        this.options = options;
    }

    getPackager(type, pkg) {
        if (type === "js") {
            return new JSPackager(pkg, this.options);
        }
        else if(type === "css") {
            return new CSSPackager(pkg, this.options);
        }
        else {
            return new RAWPackager(pkg, this.options);
        }
    }

    async packup() {
        let siblings = this.package.siblingPackages;
        let children = this.package.childPackages;
        let siblingTypes = Object.keys(siblings);

        for (let child of children) {
            let pkgr = new Packager(child, this.options)
            await pkgr.packup();
        }

        for (let sibType of siblingTypes) {
            let Pkgr = this.getPackager(sibType, siblings[sibType])
            await Pkgr.packup();
        }
    }

}

module.exports = Packager;
