import JSLoader from "./JSLoader";
import CSSLoader from "./CSSLoader";
import Loader from "./Loader";

export const getLoader = function(moduleType) {
    if (moduleType === "js") {
        return JSLoader;
    }
    else if (moduleType === "css") {
        return CSSLoader;
    }
    else {
        // If file type is not supported then return raw loader.
        return Loader;
    }
};
