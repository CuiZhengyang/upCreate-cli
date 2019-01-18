#!/usr/bin/env node
var program = require('commander');
var clear =require("clear");
var figlet =require("figlet");
var chalk=require("chalk");
var pack=require("../package")

program
    .version(pack.version)
    .option('-init <project name>', 'init project with name for local')


// clear();
//用于描述模块的功能
console.log(
    chalk.green(
        figlet.textSync('UPCREATE', { horizontalLayout: 'full' })+'\n',
        chalk.green(
            '-----------------------this made by Cui Zhengyang\n'
        ),
        chalk.green(
            '*************************************************************************************\n'+
            '* 一个直接可以生成webpack4+babel7+scss/less/postcss+Redux+react-router 的cli工具    *\n'+
            '*************************************************************************************\n\n'
        ),
        chalk.green(
            "Options:\n" +
            "  -V, --version         output the version number\n" +
            "  -init <project name>  init project with name for local\n" +
            "  -h, --help            output usage information\n"
        )
    )
);


require( '../' );


