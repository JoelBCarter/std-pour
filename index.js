const { spawn } = require('child_process'),
    fs = require('fs');

const pour = (cmd, args, opts, stdout = process.stdout, stderr = process.stderr) => {
    return new Promise((resolve, reject) => {
        const p = spawn(cmd, args, opts);
        p.stdout.on('data', data => {
            stdout.write(data);
        });
        p.stderr.on('data', data => {
            stderr.write(data);
        });
        p.on('close', code => {
            resolve(code);
        });
    });
}
const pourConsole = pour;

const pourFile = (cmd, args, opts, stdoutFile, stderrFile = stdoutFile) => {
    const stdout = fs.createWriteStream(stdoutFile),
        stderr = stdoutFile === stderrFile ? stdout : fs.createWriteStream(stderrFile);
    return pour(cmd, args, opts, stdout, stderr).then(code => {
        stdout.end();
        if (stdoutFile !== stderrFile) {
            stderr.end();
        }
        return code;
    });
}

module.exports = {
    pour,
    pourConsole,
    pourFile,
};
