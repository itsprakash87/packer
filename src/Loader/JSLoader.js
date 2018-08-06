const babel = require("babel-core");
const { getDependenciesByAst } = require("./JSDependencies");
const Loader = require("./Loader");

class JSLoader extends Loader {

    constructor(content, options={}) {
        super(content, options);

        this.ast;
        this.transformedContent;
    }

    parse() {
        if (!this.ast || !this.transformedContent) {
            let parserPlugins = ["jsx", "dynamicImport"];
            let result = babel.transform(
                this.pretransformedContent, 
                {
                    parserOpts: { plugins: parserPlugins, sourceType: "module" },
                    extends: this.options.babelrc
                }
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

        return getDependenciesByAst({ ast: this.ast }) || [];
    }
};

module.exports = JSLoader;