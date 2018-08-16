import A from "./b";

const B = require("./c");

function Temp() {
    var k = require("./d");
}

function Temp2() {
    var require = function(){};
    // Should not be included in dependency as require is overridden.
    require("./e");
}

export * from "./b"; 

import("./k").then(() => {})