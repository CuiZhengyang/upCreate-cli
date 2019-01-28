var inquirer = require('inquirer');
var program = require('commander');
var path = require('path');
var fsUtil = require("../util/fsUtil");
var absoluteDirPath = "";
const download = require('download-git-repo')
const ora = require('../util/oraLoading');
const chalk = require('chalk')
const cmd = require('node-cmd');
var figlet = require("figlet");

const EventEmitter = require('events');
var emitter = new EventEmitter();
const {exec} = require('child_process');

let commandArray = [];
let doCmd = null, hasError = false, doResult = {};

function* doCommand() {
    for (let cmd of commandArray) {
        let spinner2 = ora.OraLoading(chalk.green(`npm install ${cmd}`));
        spinner2.start();
        yield exec(`npm install ${cmd}`, (err, stdout, stderr) => {
            if (err) {
                hasError=true;
                console.log(chalk.red('Error:', +err))
            }
            else {
                console.log("")
                console.log(stdout);
            }
            spinner2.succeed(`Done!!`)
            console.log("")
            emitter.emit("nextCmd");
        });
    }
    console.log(chalk.green('Your project has been created successfully!'));
    console.log(chalk.green("Your can run 'npm run dev' to start hot server!"));
    console.log(chalk.green("Your can run 'npm run buld' to create product files!"));
    console.log(chalk.green(figlet.textSync('thanks  use !',
        {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        })));

}

emitter.on("nextCmd", () => {
    if (hasError) {
        console.log(chalk.red('An error occurred while npm install, please correct the error，and then'));
        console.log(chalk.green("You can run 'npm run dev' to start hot server!"));
        console.log(chalk.green("You can run 'npm run buld' to create product files!"));
        console.log(chalk.green(figlet.textSync('thanks  use !',
            {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })));
    }
    else if (!!doCmd) {
        doResult = doCmd.next()
    }
})


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
        ["react+react-router+redux+immutable", "direct:https://github.com/CuiZhengyang/webpack4-babel7-react-router-redux.git"],
        ["react+react-router+redux", "direct:https://github.com/CuiZhengyang/webpack4-babel7-react-router-redux.git#ReactRedux"],
        ["react+react-router", "direct:https://github.com/CuiZhengyang/webpack4-babel7-react-router-redux.git#ReactRouter"],
    ])

    inquirer.prompt([{
        type: 'list',
        name: 'templete',
        choices: [...map.keys()],
        message: "What kind of template do you want?"
    }]).then((result) => {

        var gitUrl = map.get(result.templete);
        // console.log(gitUrl,dirName)
        if (!!gitUrl) {
            //创建loading
            const spinner = ora.OraLoading('generating', absoluteDirPath);
            //打开loading
            spinner.start();

            download(gitUrl, dirName, {clone: true}, function (err) {
                //关闭loading
                spinner.stop();
                if (!!err) {
                    console.log(chalk.red(err))
                    return;
                }
                //编写配置文件，放到相应的文件夹下面
                spinner.succeed(chalk.green(`generated '${absoluteDirPath}' successed`));

                process.chdir(dirName);
                var pkg = require(absoluteDirPath + "/package.json");
                var dependencArray = !!pkg.dependencies && Object.keys(pkg.dependencies)|| [];
                var devDependenceArray = !!pkg.devDependencies && Object.keys(pkg.devDependencies).reverse()  || [];
                commandArray = [...devDependenceArray, ...dependencArray]

                console.log(chalk.green('npm install dependence,this step will take a little time, please wait!'))

                doCmd = doCommand();
                doResult = doCmd.next();

            })
        }

    })
}
