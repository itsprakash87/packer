const JSLoader = require("../src/Loader/JSLoader");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")
const fs = require("fs");

const aFileContnent = fs.readFileSync(path.resolve(__dirname, "./helperFiles/JSLoaderTest/a.js"));

describe('JSLoader class getDependencies function', function() {
  it('should return correct dependecies', function() {
    let a = new JSLoader(aFileContnent);

    let deps = a.getDependencies();

    chai.assert.strictEqual(deps.length, 6);

    chai.assert.strictEqual(deps[0].value, './b');
    chai.assert.strictEqual(deps[0].type, 'ImportDeclaration');

    chai.assert.strictEqual(deps[1].value, './c');
    chai.assert.strictEqual(deps[1].type, 'RequireCallExpression');

    chai.assert.strictEqual(deps[2].value, './d');
    chai.assert.strictEqual(deps[2].type, 'RequireCallExpression');

    chai.assert.strictEqual(deps[3].value, './b');
    chai.assert.strictEqual(deps[3].type, 'ExportAllDeclaration');

    chai.assert.strictEqual(deps[4].value, './k');
    chai.assert.strictEqual(deps[4].type, 'DynamicImportDeclaration');
  })
})
