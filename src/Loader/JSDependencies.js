const babel = require("babel-core");
const types = require("babel-types");
const template = require('babel-template');
const walk = require("babylon-walk");

module.exports.getDependenciesByCode = function getDependenciesByCode(obj = {}) {
    let code = obj.code || "";
    let plugins = ['dynamicImport'];

    let result = babel.transform(code, { parserOpts: { plugins: plugins, sourceType: "module" } })

    return exports.getDependenciesByAst({ code: result.ast });
}

module.exports.getDependenciesByAst = function getDependenciesByAst(obj = {}) {
    let deps = [];

    const visitors = {
        ImportDeclaration(node, asset) {
            deps.push({ value: node.source.value, type: "ImportDeclaration" })
        },

        ExportNamedDeclaration(node, asset) {
            node.source && deps.push({ value: node.source.value, type: "ExportNamedDeclaration" })
        },

        ExportAllDeclaration(node, asset) {
            deps.push({ value: node.source.value, type: "ExportAllDeclaration" })
        },

        CallExpression(node, asset, anc) {
            if (node.callee.name === "require" && node.arguments.length === 1 && types.isStringLiteral(node.arguments[0]) && !hasBinding(anc, "require")) {
                deps.push({ value: node.arguments[0].value, type: "RequireCallExpression" })
            }
            else if (node.callee.type === "Import" && node.arguments.length === 1 && types.isStringLiteral(node.arguments[0])) {
                deps.push({ value: node.arguments[0].value, type: "DynamicImportDeclaration" })

                node.callee = template('require("_dynamic_loader")')().expression;
                node.arguments[0] = template('DYNAMIC_MODULE')({DYNAMIC_MODULE: node.arguments[0]}).expression;
                deps.astChanged = true;
            }
        }
    };

    walk.ancestor(obj.ast, visitors);

    return deps;
}

// Inspired from parcel package.
// This method ensure that passed 'name' argument does not have any binding.
// It is used to make sure 'require' call actually point to global 'require' in module.
// If this method returns true, that means some statement/declaration has override the 'require' variable.
// So it is not a dependency actually.

function hasBinding(node, name) {
    if (Array.isArray(node)) {
        return node.some(ancestor => hasBinding(ancestor, name));
    }
    else if (types.isProgram(node) || types.isBlockStatement(node) || types.isBlock(node)) {
        return node.body.some(statement => hasBinding(statement, name));
    }
    else if (types.isFunctionDeclaration(node) || types.isFunctionExpression(node) || types.isArrowFunctionExpression(node)) {
        return (
            (node.id !== null && node.id.name === name) ||
            node.params.some(
                param => types.isIdentifier(param) && param.name === name
            )
        );
    }
    else if (types.isVariableDeclaration(node)) {
        return node.declarations.some(declaration => declaration.id.name === name);
    }

    return false;
}

