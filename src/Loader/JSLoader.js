var babel = require("babel-core");

import babel from "babel-core";
import Loader from  "./Loader";

class JSLoader extends Loader {

    constructor(content, options={}) {
        super(content, options);

        this.ast;
        this.transformedContent;
    }

    parse() {
        // Do nothing for non supporting extensions.
        if (!this.ast) {
            this.ast = {};
        }
        return this.ast;
    }

    transform() {
        // Do nothing for non supporting extensions.
        this.parse();
        this.transformedContent = this.pretransformedContent;
        return this.transformedContent;
    }

    getDependencies() {
        // Do nothing for non supporting extensions.
        return new Set();
    }
};

export default JSLoader;