import JSPackager from "./JSPackager";
import CSSPackager from "./CSSPackager";
import Packager from "./Packager";

export const getPackager = function(packageType) {
    if (packageType === "js") {
        return JSPackager;
    }
    else if (packageType === "css") {
        return CSSPackager;
    }
    else {
        // If file type is not supported then return raw packager.
        return Packager;
    }
};
