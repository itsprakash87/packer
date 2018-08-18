if(process.env.NODE_ENV === "production") {
    require("./a")
}
else {
    require("./b")
}