const babel = require("babel-core");
const { replaceEnvVarsWithValues } = require("../src/Loader/JSEnvVars");
const chai = require("chai");

const code = "process.env.NODE_ENV === 'production';";

process.env.NODE_ENV = 'production';

describe('JSEnvVars function replaceEnvVarsWithValues ', function() {
  it('should replace the environment properties with the values', function() {
    let result = babel.transform(code,{ code: false });

    replaceEnvVarsWithValues(result.ast);

    result = babel.transformFromAst(result.ast, code);

    chai.assert.strictEqual(result.code, "'production' === 'production';");
  });
});
