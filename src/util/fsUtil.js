var fs = require("fs");
const ora = require('../util/oraLoading');


exports.dirExists = (path) => {
    return fs.existsSync(path)
}

function dirRemove(path) {
    if (fs.existsSync(path)) {
        var files = [];
        files = fs.readdirSync(path)

        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                dirRemove(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
exports.dirRemove=(path)=>{
    dirRemove(path)
};

exports.dirRemoveAll = (path) => {
    const spinner = ora.OraLoading('removing', path);
    spinner.start();
    try {
        dirRemove(path)
    }
    catch (e) {
        console.log(e)
        spinner.succeed("");
    }
    finally {
        spinner.succeed("");
    }
}