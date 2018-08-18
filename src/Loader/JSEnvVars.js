const types = require("babel-types");
const traverse = require('babel-traverse').default;

module.exports.replaceEnvVarsWithValues = function replaceEnvVarsWithValues(ast) {
    const visitors = {
      MemberExpression(path) {
        if (path.get("object").matchesPattern("process.env")) {
          const key = path.toComputedKey();
          if (types.isStringLiteral(key)) {
            path.replaceWith(types.valueToNode(process.env[key.value] || ""));
          }
        }
      }
    };

    traverse(ast, visitors);
}