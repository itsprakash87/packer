const chalk = require('chalk');
const log = require('single-line-log').stdout;

module.exports.log = function(str) {
    log(chalk.green(str + "\n"))
};

module.exports.error = function(str) {
    log(chalk.red(str+ "\n"))
};

module.exports.clear = function() {
    log.clear();
};

module.exports.persistLog = function(str) {
    console.log(chalk.green(str))
};

module.exports.persistError = function(str) {
    log(chalk.red(str + "\n"))
};
