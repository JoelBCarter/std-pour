const { spawn } = require('child_process');

const enact = (cmd, args, opts, stdout = process.stdout, stderr = process.stderr) => {
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

module.exports = {
    enact,
};
