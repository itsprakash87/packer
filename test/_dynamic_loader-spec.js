const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const chai = require("chai");
const path = require("path");
const sinon = require("sinon")
const fs = require("fs");
const _dynamic_loader = require("../src/Loader/_dynamic_loader");

var rq = function(){};

rq.resolve = function(){
    return "abcdef";
};

describe('_dynamic_loader module', function() {
  it('should correctly lazy load js dependency when dependency is not already loaded', async function() {
    let dom = new JSDOM(`<!DOCTYPE html><head></head><body></body></html>`);
    
    global.window = dom.window;
    global.document = dom.window.document;

    global._PACKER_REQUIRE = sinon.stub()
                            .onFirstCall().returns(null)
                            .onSecondCall().returns("/lazy.123.js")
                            .onThirdCall().returns({done: true});

    _dynamic_loader(rq)("../lazy.js");

    chai.assert.strictEqual(global._PACKER_REQUIRE.callCount, 2);
    chai.assert.strictEqual(dom.window.document.getElementsByTagName('head')[0].children.length, 1);
    chai.assert.strictEqual(dom.window.document.getElementsByTagName('head')[0].children[0].src, "/lazy.123.js");
  })

  it('should load js dependency from cache when dependency is already loaded', async function() {
    let dom = new JSDOM(`<!DOCTYPE html><head></head><body></body></html>`);
    
    global.window = dom.window;
    global.document = dom.window.document;

    global._PACKER_REQUIRE = sinon.stub()
                            .onFirstCall().returns({})

    _dynamic_loader(rq)("../lazy.js");

    chai.assert.strictEqual(global._PACKER_REQUIRE.callCount, 1);
  })
})

describe('_dynamic_loader module', function() {
  it('should correctly lazy load css dependency when dependency is not already loaded', async function() {
    let dom = new JSDOM(`<!DOCTYPE html><head></head><body></body></html>`);
    
    global.window = dom.window;
    global.document = dom.window.document;

    global._PACKER_REQUIRE = sinon.stub()
                            .onFirstCall().returns(null)
                            .onSecondCall().returns("/lazy.123.css")
                            .onThirdCall().returns({done: true});

    _dynamic_loader(rq)("../lazy.css");

    chai.assert.strictEqual(global._PACKER_REQUIRE.callCount, 2);
    chai.assert.strictEqual(dom.window.document.getElementsByTagName('head')[0].children.length, 1);
    chai.assert.strictEqual(dom.window.document.getElementsByTagName('head')[0].children[0].href, "/lazy.123.css");
  })

  it('should load css dependency from cache when dependency is already loaded', async function() {
    let dom = new JSDOM(`<!DOCTYPE html><head></head><body></body></html>`);
    
    global.window = dom.window;
    global.document = dom.window.document;

    global._PACKER_REQUIRE = sinon.stub()
                            .onFirstCall().returns({})

    _dynamic_loader(rq)("../lazy.css");

    chai.assert.strictEqual(global._PACKER_REQUIRE.callCount, 1);
  })
})
