const Loader = require("./Loader");

class CssLoader extends Loader {

    constructor(content, options={}) {
        super(content, options);
    }
};

module.exports = Loader;