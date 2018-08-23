#!/usr/bin/env node

const argv = require('yargs').argv
const Packer = require("./Packer");
const path = require("path");

let command, files, options = {};

if (argv._.length === 0) {
    command = "build";
}
else if (argv._.length === 1 && argv._[0] !== "build") {
    files = [argv._[0]];
    command = "build";
}
else if (argv._.length > 1) {
    if (argv._[0] === "build") {
        files = [].concat(argv._.slice(1));
    }
    else {
        files = [].concat(argv._);
    }
    
    command = "build";
}

if (!command) {
    console.error("Command not found.");
    process.exit(0);
}
else if (!files) {
    console.error("No input file specified.");
    process.exit(0);
}

options = Object.assign({}, argv);

let cwd = process.cwd();

if (options.outDir || options.o) {
    options.outDir = path.resolve(cwd, (options.outdir || options.o));
}
else {
    console.error("No output directory specified.");
    process.exit(0);
}

if (options.publicPath) {
    options.publicPath = path.resolve(cwd, options.publicPath);
}

if (options.babelrc) {
    options.babelrc = path.resolve(cwd, options.babelrc);
}

if (Array.isArray(files)) {
    files.map(function(fn, ind) {
        files[ind] = path.resolve(cwd, files[ind]);
    })
}

let packer = new Packer(files, options);

packer.pack();