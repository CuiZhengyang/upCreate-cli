var program = require('commander');
var chalk = require("chalk")
program.parse(process.argv); //开始解析用户输入的命令
// console.log(program.args)
if (program.args.length != 0) {
    var commandArray = ["init"];
    if (!commandArray.includes(program.args[0])) {
        console.log(chalk.red("不存在的命令！请通过'upcreate -h'or 'upcreate -help' 查看命令！\n"));
        return;
    }

    require('./command/' + program.args[0] + '.js') // 根据不同的命令转到不同的命令处理文件

}
