const Module = require("../src/Module");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")

describe('Module class constructor ', function() {
  it('should return same instance for same module', function() {
    let a = new Module("/temp/a.js");
    let b = new Module("/temp/a.js");

    chai.assert.strictEqual(a,b);
  })

  it('should return new instance for new module', function() {
    let c = new Module("/temp/c.js");
    let d = new Module("/temp/d.js");

    chai.assert.notStrictEqual(c, d);
  })
})

describe('Module class readModule', function() {
  it('should read the module', async function() {
    let a = new Module(path.resolve(__dirname, "./helperFiles/ModuleTest/a.js"));

    chai.assert.strictEqual(a.pretransformedContent, undefined);
    await a.readModule();

    chai.expect(a.pretransformedContent).to.be.an('string')
  })
})

describe('Module class createDependencyTree', function() {
  it('should create correct tree', async function() {
    let a = new Module(path.resolve(__dirname, "./helperFiles/ModuleTest/a.js"));

    let dependencyStub = sinon.stub(a.loader, "getDependencies");
    let transformStub = sinon.stub(a.loader, "transform");

    dependencyStub
    .onFirstCall().returns([{value: path.resolve(__dirname, "./helperFiles/ModuleTest/b.js")}])
    .onSecondCall().returns([]);

    transformStub.returns("use strict;");

    await a.createDependencyTree();

    chai.assert.equal(Object.keys(a.deps).length, 1);
    chai.assert.equal(a.depsModules.size, 1);
    chai.assert.strictEqual(Object.keys(a.deps)[0], path.resolve(__dirname, "./helperFiles/ModuleTest/b.js"))
  })
})

