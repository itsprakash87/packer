// Represent the final bundle.
// Contain all information about a particular bundle.

class Package {

    constructor() {
        this.packageName;
        this.modules = new Set();
        this.childPackages = new Set();
        this.parentPackage;
    }

    addModule(modu) {
        this.modules.add(modu);
    }

    removeModule(modu) {
        this.modules.delete(modu);
    }

    createChildPackage() {
        let childPackage = new Package();

        this.childPackages.add(childPackage);
        childPackage.parentPackage = this;
        return childPackage;
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
