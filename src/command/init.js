var inquirer = require('inquirer');
var program = require('commander');
var path = require('path');
var fsUtil = require("../util/fsUtil");
var absoluteDirPath = "";
const clone = require('../util/git').clone;
const ora = require('../util/oraLoading');
const chalk = require('chalk')
var figlet = require("figlet");
const {spawn} = require('child_process');

const registries=require("../util/registrys").registry


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
            inputQuestion("project name can't be empty,try again!", resolve)
        }
        else {
            resolve(answers.dirName)
        }
    })

}

/**
 * 获取项目名称
 * @param discription  问题描述
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

function createProject(dirName) {
    //项目的根目录地址
    absoluteDirPath = path.resolve(process.cwd(), dirName);

    //判断文件夹是否存在
    if (fsUtil.dirExists(absoluteDirPath)) {
        //如果文件已经存在判断
        console.log(chalk.yellow("Warning:" + dirName + " in '" + process.cwd() + "' has been created!!"));
        //询问是否要删除,重建文件夹
        inquirer.prompt([{
            type: 'confirm',
            name: 'delete',
            message: "Do you want to delete the folder and recreate it?"
        }]).then((result) => {

            if (result.delete) {
                fsUtil.dirRemoveAll(absoluteDirPath)
                setTimeout(function () {
                    downloadFromGitHub(dirName)
                }, 1000)
            } else {
                getProjectName("what's your project name?").then((dirName) => {
                    createProject(dirName)
                })
            }
        })
    }
    else {
        downloadFromGitHub(dirName)
    }
}



//从github上下载文件
function downloadFromGitHub(dirName) {
    var map = new Map([
        ["react+react-router+redux+immutable", "master"],
        ["react+react-router+redux", "ReactRedux"],
        ["react+react-router", "ReactRouter"],
    ])

    let regKeyArray=Object.keys(registries);

    let registriesArray=regKeyArray.map((item)=>{
        return item.padEnd(10,'-')+registries[item].registry;
    })

    inquirer.prompt([{
        type: 'list',
        name: 'templete',
        choices: [...map.keys()],
        message: "What kind of template do you want?"
    },{
        type: 'list',
        name: 'registry',
        choices: [...registriesArray],
        message: "Which source? （If you can't access the Internet, you are advised to use Taobao.）"
    },]).then((result) => {

        var branch = map.get(result.templete);
        // console.log(gitUrl,dirName)
        if (!!branch) {
            //创建loading
            const spinner = ora.OraLoading('generating', absoluteDirPath);
            //打开loading
            spinner.start();
            var repo = "git://github.com/CuiZhengyang/webpack4-babel7-react-router-redux.git";

            clone({
                repo,
                branch,
                targetPath:dirName
            }, function (err) {
                spinner.stop();
                if (!!err) {
                    console.log(chalk.red(err))
                    return;
                }
                //编写配置文件，放到相应的文件夹下面
                spinner.succeed(chalk.green(`generated '${absoluteDirPath}' successed`));
                process.chdir(dirName);
                fsUtil.dirRemove(".git");

                console.log(chalk.green('npm install dependence,this step will take a little time, please wait! or you can Press Ctrl+c and "npm install" by yourself'))

                let rg=result.registry.split('-')[0]

                let npm = spawn(process.platform=="win32"?'npm.cmd':'npm', ['install','--registry',registries[rg].registry], {
                    // shell: true,
                    cwd: absoluteDirPath,
                    // detached: true,
                    // windowsHide: true
                });
                npm.stdout.on('data', (data) => {
                    console.log(`${data}`);
                });

                npm.on('close', (code) => {
                    console.log(chalk.green('Your project has been created successfully!'));
                    console.log(chalk.green("Your can run 'npm run dev' to start hot server!"));
                    console.log(chalk.green("Your can run 'npm run buld' to create product files!"));
                    console.log(chalk.green(figlet.textSync('thanks  use !',
                        {
                            font: 'Ghost',
                            horizontalLayout: 'default',
                            verticalLayout: 'default'
                        })));
                });
            })

        }

    })
}
