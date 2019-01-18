var fs = require("fs");

function fsAccess(path) {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (!!err)
                resolve(false)
            else
                resolve(true);
        });
    })
}

exports.dirExists = async (path) => {
    let result = await fsAccess(path)
    return Promise.resolve(result);
}
