const CSSPackager = require("../src/Packager/CSSPackager");
const Package = require("../src/Package");
const Module = require("../src/Module");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")
const fs = require("fs");

describe('Packager class packup function', function() {
  it('should should correctly generate output file content', async function() {
    let aCssFile = path.resolve(__dirname, "./helperFiles/CSSPackagerTest/a.css")
    let bCssFile = path.resolve(__dirname, "./helperFiles/CSSPackagerTest/b.css")
    let mdA = new Module(aCssFile);
    let mdB = new Module(bCssFile);

    await mdA.createDependencyTree()
    await mdB.createDependencyTree();
    let pkg = new Package(mdA);

    pkg.addModule(mdB);
    let packager = new CSSPackager(pkg, {publicPath: "/"});

    let spitFileStub = sinon.stub(packager, "spitFile");
    spitFileStub.callsFake(function() {});

    packager.packup();

    chai.assert.strictEqual(packager.outFile, expectedContent);
    chai.assert.strictEqual(spitFileStub.calledOnce, true);
  })
})

const expectedContent = `div {
    margins: 0px;
}

body {
    padding: 0px;
}

`;