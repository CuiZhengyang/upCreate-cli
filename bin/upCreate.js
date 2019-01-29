#!/usr/bin/env node
var program = require('commander');
var figlet = require("figlet");
var chalk = require("chalk");
var pack = require("../package")


program
    .version(pack.version)
    .option('-init <project name>', 'init project with name for local')


// clear();
//用于描述模块的功能
console.log(
    chalk.green(
        figlet.textSync('UPCREATE', {horizontalLayout: 'full'}) + '\n',
        chalk.green('-----------------------this was made by Cui Zhengyang\n')
    )
);
console.log(chalk.green('*************************************************************************************\n'))
console.log(
    chalk.green(pack.description + '\n\n'),
    chalk.green('\tTips:Please node --version >= 8 \n\n'),
    chalk.green(
        "Options:\n" +
        "  -V, --version         output the version number\n" +
        "  -init <project name>  init project with name for local\n" +
        "  -h, --help            output usage information\n"
    ))
console.log(chalk.green('*************************************************************************************\n'))
require('../');
