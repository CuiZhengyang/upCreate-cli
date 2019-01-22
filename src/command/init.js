var inquirer = require('inquirer');
var program = require('commander');
var path = require('path');
var fsUtil = require("../util/fsUtil");


program
    .command('init')
    .description('init project for local')
    .action(function (options) { //list命令的实现体
        if (typeof options === 'string') {
            createProject(options)
        }
        else {
            getProjectName("what's your project name?").then((dirName) => {
                createProject(dirName)
            })

        }

    });
program.parse(process.argv); //开始解析用户输入的命令

/**
 * input类型的端口号
 * @param discription
 * @param resolve
 */
function inputQuestion(discription, resolve) {
    inquirer.prompt([{
        type: 'input',
        name: 'dirName',
        message: discription,
    }]).then((answers) => {
        if (answers.dirName.length == 0) {
            return Promise.resolve({
                isAgainToken: true,
                discription: "project name can't be empty,try again!"
            });
        }
        return Promise.resolve({
            isAgainToken: false,
            dirName: answers.dirName
        });

    }).then((result) => {
        if (result.isAgainToken) {
            inputQuestion(result.discription, resolve)
        }
        else {
            resolve(result.dirName)
        }
    })

}

/**
 * 获取项目名称
 * @param discription
 * @returns {Promise<any>}
 */
function getProjectName(discription) {
    return new Promise((resolve, reject) => {
        inputQuestion(discription, resolve)
    })
}

/**
 * 创建项目
 * @param dirName
 */
const download = require('download-git-repo')
const ora = require('../util/oraLoading');
const chalk=require('chalk')
function createProject(dirName) {
    //项目的根目录地址
    dirPath = path.resolve(process.cwd(), dirName);
    fsUtil.dirExists(dirPath).then((isExist)=>{
        if(isExist){
            getProjectName(dirName+" in '/Users/cuizhengyang/WebstormProjects/upCreate-cli' has been created,you need a new name! ").then((dirName) => {
                createProject(dirName)
            })
        }
        else{
            //创建loading
            const spinner = ora.OraLoading('generating',dirPath);
            //打开loading
            spinner.start();
            download('direct:https://github.com/CuiZhengyang/webpack4-babel7-react-router-redux.git', dirName , { clone: true }, function (err) {
                //关闭loading
                spinner.stop();
                if(!!err)
                {
                    console.log(chalk.red(err))
                    return;
                }
                //编写配置文件，放到相应的文件夹下面


                spinner.succeed( chalk.green(`generated '${dirPath}' successed` ));
            })
        }
    })

}