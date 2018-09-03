class Package {

    constructor(entryModule, parentPackage, siblingPackages) {
        this.entryModule = entryModule;
        this.type = entryModule && entryModule.type;
        this.modules = new Set();
        this.childPackages = new Set();
        this.parentPackage = parentPackage;
        this.siblingPackages = siblingPackages || {};
        this.bundleUrls = [];

        this.siblingPackages[this.type] = this;
        this.modules.add(entryModule);
    }

    addModule(modu) {
        this.modules.add(modu);
        modu.package = this;
    }

    removeModule(modu) {
        this.modules.delete(modu);
        modu.package = null;
    }

    createChildPackage(entryModule) {
        let childPackage = new Package(entryModule, this);

        this.childPackages.add(childPackage);
        entryModule.package = childPackage;
        return childPackage;
    }

    getSiblingPackageForModule(mod) {
        if (!this.siblingPackages[mod.type]) {
            this.siblingPackages[mod.type] = new Package(mod, this.parentPackage, this.siblingPackages);
        }

        return this.siblingPackages[mod.type];
    }

    getCommonAncestor(pkg) {
        let allParents = [];
        let thisPackageParent = this;
        let otherPackageParent = pkg;

        while (thisPackageParent) {
            allParents.push(thisPackageParent);
            thisPackageParent = thisPackageParent.parentPackage;
        }

        while (otherPackageParent && allParents.indexOf(otherPackageParent) < 0) {
            otherPackageParent = otherPackageParent.parentPackage;
        }

        return otherPackageParent;
    }

}

module.exports = Package;
