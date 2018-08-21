const CSSLoader = require("../src/Loader/CSSLoader");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")
const fs = require("fs");

describe('CSSLoader class getDependencies function', function() {
  it('should return correct dependecies', async function() {
    let aFileContnent = fs.readFileSync(path.resolve(__dirname, "./helperFiles/CSSLoaderTest/a.css"));
    let a = new CSSLoader(aFileContnent, path.resolve(__dirname, "./helperFiles/CSSLoaderTest/a.css"), {publicPath:"/"});

    let deps = await a.getDependencies();

    chai.assert.strictEqual(deps.length, 1);

    chai.assert.strictEqual(deps[0].name, path.resolve(__dirname, "./helperFiles/CSSLoaderTest/x.png"));
  })
})

describe('CSSLoader class transform function', function() {
  it('should return correct transformed css', async function() {
    let aFileContnent = fs.readFileSync(path.resolve(__dirname, "./helperFiles/CSSLoaderTest/a.css"));
    let a = new CSSLoader(aFileContnent, path.resolve(__dirname, "./helperFiles/CSSLoaderTest/a.css"), {publicPath:"/"});

    let content = await a.transform();

    chai.assert.strictEqual(content, expectedTransformedCss);
  })
})


const expectedTransformedCss = 
`.b {
    color: gray;
}

body {
    background: url('/x.d41d8.png')
}`