const JSLoader = require("../src/Loader/JSLoader");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")
const fs = require("fs");

describe('JSLoader class getDependencies function', function() {
  it('should return correct dependecies', function() {
    let aFileContnent = fs.readFileSync(path.resolve(__dirname, "./helperFiles/JSLoaderTest/a.js"));
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

describe('JSLoader class getDependencies function', function() {
  it('should return correct dependecies when NODE_ENV is production', function() {
    process.env.NODE_ENV = 'production';
    let envFileContnent = fs.readFileSync(path.resolve(__dirname, "./helperFiles/JSLoaderTest/env_dependency.js"));
    let a = new JSLoader(envFileContnent);

    let deps = a.getDependencies();

    chai.assert.strictEqual(deps.length, 1);

    chai.assert.strictEqual(deps[0].value, './a');
    chai.assert.strictEqual(deps[0].type, 'RequireCallExpression');
  })

  it('should return correct dependecies when NODE_ENV is development', function() {
    process.env.NODE_ENV = 'development';
    let envFileContnent = fs.readFileSync(path.resolve(__dirname, "./helperFiles/JSLoaderTest/env_dependency.js"));
    let a = new JSLoader(envFileContnent);

    let deps = a.getDependencies();

    chai.assert.strictEqual(deps.length, 1);

    chai.assert.strictEqual(deps[0].value, './b');
    chai.assert.strictEqual(deps[0].type, 'RequireCallExpression');
  })
})
