/**
 *
 * @param branch 分支名称
 */

const {spawn} = require('child_process');

function gitCmd(args) {
    return spawn('git', args);
}

exports.clone = (config,cb) => {

    let {repo, branch, targetPath}=config;
    let args = ['clone'];
    args.push("-b")
    args.push(branch)
    args.push("--depth")
    args.push("1")
    args.push("--single-branch")
    args.push(repo)
    args.push(targetPath)
    let git = gitCmd(args);

    git.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    git.on('close', function (status) {
        if (status == 0) {
            cb && cb();
        } else {
            cb && cb(new Error("'git clone' failed with status " + status));
        }
    });
}