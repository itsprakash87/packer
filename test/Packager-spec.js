const Packager = require("../src/Packager/Packager");
const Package = require("../src/Package");
const JSPackager = require("../src/Packager/JSPackager");
const CSSPackager = require("../src/Packager/CSSPackager");
const RAWPackager = require("../src/Packager/RAWPackager");
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")

describe('Packager class getPackager function', function() {
  it('should return right packager instance for js type', function() {
    let pkg = new Package("/temp/a.js");
    let packager = new Packager(pkg);

    let jsPackager = packager.getPackager("js", pkg);

    chai.assert.strictEqual(jsPackager instanceof JSPackager, true);
  })
  it('should return right packager instance for css type', function() {
    let pkg = new Package("/temp/a.css");
    let packager = new Packager(pkg);

    let cssPackager = packager.getPackager("css", pkg);

    chai.assert.strictEqual(cssPackager instanceof CSSPackager, true);
  })
  it('should return right packager instance for raw types', function() {
    let pkg = new Package("/temp/a.png");
    let packager = new Packager(pkg);

    let rawPackager = packager.getPackager("png", pkg);

    chai.assert.strictEqual(rawPackager instanceof RAWPackager, true);
  })
})

