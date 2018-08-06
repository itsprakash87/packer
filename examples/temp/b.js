import * as c from "./c";

export const callC = () => {
    c.callIt();
}

export const callIt = () => {
    console.log("This is B");
}