// Parent class for other loaders. Define the default function to be overridden by subclasses.
// It parses, transform, create dependency tree of files.

class Loader {

    constructor(content, options={}) {
        this.pretransformedContent = content || "";
        this.options = options;
        this.ast;
        this.transformedContent;
    }

    getPretransformedContent() {
        return this.pretransformedContent;
    }

    getTransformedContent() {
        if (!this.transformedContent) {
            this.transform();
        }
        return this.transformedContent;
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

export default Loader;