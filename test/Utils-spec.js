const utils = require("../src/Utils");
const chai = require("chai");

describe('Util function isNodeModule ', function() {
  it('should return false for non Node modules', function() {
    chai.assert.strictEqual(utils.isNodeModule("./a"), false);
  });

  it('should return true for Node modules', function() {
    chai.assert.strictEqual(utils.isNodeModule("chai"), true);
  });
});

describe('Util function isNodeCoreModule ', function() {
  it('should return false for non core modules', function() {
    chai.assert.strictEqual(utils.isNodeCoreModule("abc"), false);
  });

  it('should return true for core modules', function() {
    chai.assert.strictEqual(utils.isNodeCoreModule("path"), true);
  });
});