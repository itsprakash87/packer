import * as a from "./a";
var ff = require("react")

console.log("calling A");
a.callIt();


console.log("callling C from A");
a.callC();


setTimeout(() => {
import("./b").then((b) => {
    console.log("Got b")
        
    console.log("callling B");
    b.callIt();

    console.log("callling C from B");
    b.callC();
})}, 5000)