const Loader = require("./Loader");
const postcss = require("postcss");
const atImport = require("postcss-import")
const url = require("postcss-url")
const path = require('path');

const { getHashOfFileSync } = require("../Utils");

class CSSLoader extends Loader {

    constructor(content, name, options={}) {
        super(content, name, options);
        this.transformedContent;
        this.deps = [];
    }

    async parse() {
        if (!this.transformedContent) {
            let result = await postcss().use(atImport()).use(url({ url: this.handleUrlDeclarations.bind(this)}))
                                .process(this.pretransformedContent, { from: this.name });

            this.transformedContent = result.css;
        }
    }

    handleUrlDeclarations(asset) {
        let ext = path.extname(asset.absolutePath)
        let fileName = path.basename(asset.absolutePath, ext);
        let hash = getHashOfFileSync(asset.absolutePath, 5);

        fileName = `${fileName}.${hash}${ext}`;

        this.deps.push({ name: asset.absolutePath, value: asset.url });

        return path.join(this.options.publicPath, fileName);
    }

    async transform() {
        await this.parse();
        return this.transformedContent;
    }

    async getDependencies() {
        if (!this.transformedContent) {
            await this.parse();
        }

        return this.deps;
    }
};

module.exports = CSSLoader;