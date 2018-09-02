const HtmlInjector = require("../src/HtmlInjector");
const Package = require("../src/Package");
const Module = require("../src/Module");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")

describe('HtmlInjector class readTemplate function ', function() {
  it('should read the given template', async function() {
    let aModule = new Module("/temp/a.js");
    let pkg = new Package(aModule);
    let htmlInjector = new HtmlInjector(path.resolve(__dirname, "./helperFiles/HtmlInjectorTest/index.html"))

    pkg.bundleUrls.push({name: "a.js", url: "/assets/a.523kd.js"});

    await htmlInjector.readTemplate();

    chai.assert.notEqual(htmlInjector.document,null);
  })
})

describe('HtmlInjector class injectInHtml function ', function() {
  it('should correctly inject the urls', async function() {
    let aModule = new Module("/temp/a.js");
    let bModule = new Module("/temp/b.css");
    let pkg = new Package(aModule);
    pkg.getSiblingPackageForModule(bModule)
    let htmlInjector = new HtmlInjector(path.resolve(__dirname, "./helperFiles/HtmlInjectorTest/index.html"),pkg)

    pkg.bundleUrls.push({name: "a.js", url: "/assets/a.523kd.js"});
    pkg.getSiblingPackageForModule(bModule).bundleUrls.push({name: "b.css", url: "/assets/b.fhu3s.css"});

    await htmlInjector.readTemplate();
    await htmlInjector.injectInHtml();

    chai.assert.strictEqual(htmlInjector.document.querySelector('body').children.length, 1);
    chai.assert.strictEqual(htmlInjector.document.querySelector('head').children.length, 1);
  })
})
