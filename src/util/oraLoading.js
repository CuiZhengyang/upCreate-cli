const ora =require('ora')

exports.OraLoading=( action = 'getting', repo = '' )=>{
    const l = ora( `${action} ${repo}` );
    return l.start();
}