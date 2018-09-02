const jsdom = require("jsdom").JSDOM;
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class HtmlInjector {
    constructor(template, pkg, options) {
        this.template = template;
        this.package = pkg;
        this.options = options;

        this.window = null;
        this.document = null;
    }

    async readTemplate() {
        let str = await readFile(this.template)
        let dom = new jsdom(str);

        this.window = dom.window;
        this.document = dom.window.document;
    }

    injectInHtml() {
        let siblings = this.package.siblingPackages;
        let siblingTypes = Object.keys(siblings);

        for (let sibType of siblingTypes) {
            let pkg = siblings[sibType];
            
            if (pkg.type === "js" && pkg.bundleUrls.length > 0) {
                pkg.bundleUrls.map((k) => this.injectScript(k.url));
            }
            else if (pkg.type === "css" && pkg.bundleUrls.length > 0) {
                pkg.bundleUrls.map((k) => this.injectStyle(k.url));
            }
        }
    }

    async spitHtml() {
        let domString = this.document.querySelector('html').outerHTML;
        let outDir = this.options && this.options.outDir;
        let destPath = path.resolve(outDir, "index.html");

        await writeFile(destPath, domString);
    }

    injectScript(src) {
        let scrpt = this.document.createElement('script')

        scrpt.src = src;
        this.document.body.appendChild(scrpt)
    }

    injectStyle(href) {
        let lnk = this.document.createElement('link')

        lnk.href = href;
        lnk.rel = "stylesheet"
        this.document.head.appendChild(lnk);
    }

    async injectAndSpitHtml() {
        if(!this.window) {
            await this.readTemplate();
        }

        await this.injectInHtml();
        await this.spitHtml();
    }
};

module.exports = HtmlInjector;