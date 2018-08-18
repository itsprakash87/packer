const babel = require("babel-core");
const { getDependenciesByAst } = require("./JSDependencies");
const { replaceEnvVarsWithValues } = require("./JSEnvVars");
const Loader = require("./Loader");

class JSLoader extends Loader {

    constructor(content, options={}) {
        super(content, options);

        this.ast;
        this.transformedContent;
        this.babelOptions = {
            parserOpts: { plugins: ["jsx", "dynamicImport"], sourceType: "module" },
            extends: this.options.babelrc
        };
    }

    parse() {
        if (!this.ast || !this.transformedContent) {
            let parserPlugins = ["jsx", "dynamicImport"];
            let result = babel.transform(
                this.pretransformedContent, 
                Object.assign({}, this.babelOptions, { code: false }),
            );

            this.ast = result.ast;
            this.transformedContent = result.code;

            replaceEnvVarsWithValues(this.ast);
        }
        return this.ast;
    }

    transform() {
        this.parse();
        return this.transformedContent;
    }

    generateCode() {
        let result = babel.transformFromAst(this.ast, this.pretransformedContent, this.babelOptions);
        this.ast = result.ast;
        this.transformedContent = result.code;
    }

    getDependencies() {
        if (!this.ast) {
            this.parse();
        }

        let deps = getDependenciesByAst({ ast: this.ast }) || [];

        this.generateCode();

        return deps;
    }
};

module.exports = JSLoader;