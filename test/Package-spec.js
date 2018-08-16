const Module = require("../src/Module");
const Package = require("../src/Package");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")

describe('Package class addModule function', function() {
  it('should add module to package', function() {
    let a = new Module("/temp/a.js");
    let b = new Module("/temp/b.js");
    let aPackage = new Package(a)

    chai.assert.strictEqual(aPackage.modules.size, 1);

    aPackage.addModule(b)

    chai.assert.strictEqual(aPackage.modules.size, 2);
    chai.assert.strictEqual(b.package, aPackage);
  })
})

describe('Package class removeModule function', function() {
  it('should remove module from package', function() {
    let c = new Module("/temp/c.js");
    let d = new Module("/temp/d.js");
    let cPackage = new Package(c)

    cPackage.addModule(d)

    chai.assert.strictEqual(cPackage.modules.size, 2);
    chai.assert.strictEqual(d.package, cPackage);

    cPackage.removeModule(d)
    chai.assert.strictEqual(cPackage.modules.size, 1);
    chai.assert.strictEqual(d.package, null);
  })
})

describe('Package class createChildPackage function', function() {
  it('should create a child package', function() {
    let a = new Module("/temp/a.js");
    let b = new Module("/temp/b.js");
    let aPackage = new Package(a)

    chai.assert.strictEqual(aPackage.childPackages.size, 0);

    let childPackage = aPackage.createChildPackage(b)

    chai.assert.strictEqual(aPackage.childPackages.size, 1);
    chai.assert.strictEqual(b.package, childPackage);
  })
})

describe('Package class getSiblingPackageForModule function', function() {
  it('should return same package for same type', function() {
    let a = new Module("/temp/a.js");
    let b = new Module("/temp/b.js");
    let aPackage = new Package(a)

    let sibPackage = aPackage.getSiblingPackageForModule(b)

    chai.assert.strictEqual(aPackage, sibPackage);
  })

  it('should return new package for different type', function() {
    let a = new Module("/temp/a.js");
    let b = new Module("/temp/b.css");
    let aPackage = new Package(a)

    let sibPackage = aPackage.getSiblingPackageForModule(b)

    chai.assert.notStrictEqual(aPackage, sibPackage);
    chai.assert.strictEqual("css", sibPackage.type);
  })
})

describe('Package class getCommonAncestor function', function() {
  it('should return correct common ancestor', function() {
    let a = new Module("/temp/x.js");
    let b = new Module("/temp/y.js");
    let aPackage = new Package(a)

    let childPackage = aPackage.createChildPackage(b)
    let commonAncestor = childPackage.getCommonAncestor(aPackage);

    chai.assert.strictEqual(commonAncestor, aPackage);
  })
})

