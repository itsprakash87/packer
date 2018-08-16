const babel = require("babel-core");
const { getDependenciesByAst } = require("./JSDependencies");
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
                this.babelOptions,
            );

            this.ast = result.ast;
            this.transformedContent = result.code;
        }
        return this.ast;
    }

    transform() {
        this.parse();
        return this.transformedContent;
    }

    getDependencies() {
        if (!this.ast) {
            this.parse();
        }

        let deps = getDependenciesByAst({ ast: this.ast }) || [];

        if (deps && deps.astChanged) {
            // If ast was changed during travarsal, then retransform the code.
            let result = babel.transformFromAst(this.ast, this.pretransformedContent, this.babelOptions);
            this.ast = result.ast;
            this.transformedContent = result.code;
        }

        return deps;
    }
};

module.exports = JSLoader;