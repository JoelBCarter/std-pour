# std-pour
Promise-based subprocess execution that writes output in real-time. Go ahead, pour yourself a command 🍺.

# Usage
This library is great for chaining commands using promises, but seeing the output in real-time.

```
const { pour } = require('std-pour');
pour('ping', ['8.8.8.8', '-c', '4']).then(code => console.log(`Error Code: ${code}`));
```

This module wraps [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) so should be drop-in replacement (function signature-compatable) for any code that is using it.

```
const { spawn } = require('child_process');
const { pour } = require('std-pour');
const options = {
    cwd: '/usr',
    env: process.env
};
const ls1 = spawn('ls', ['-al'], options);
const ls2 = pour('ls', ['-al'], options);
```

# API
## pour/pourConsole
`pour` is an alias for `pourConsole`.
```
function pour (cmd, args, opts, stdout = process.stdout, stderr = process.stderr)
```
```
function pourConsole (cmd, args, opts, stdout = process.stdout, stderr = process.stderr)
```
The command, without any of the optional arguments supplied, will default to writing the `cmd`'s `stdout`/`stderr` to `process.stdout`/`process.stderr`.

## pourFile
```
function pourFile (cmd, args, opts, stdoutFile, stderrFile = stdoutFile)
```
`pourFile` is useful for writing command output to a file. `stdoutFile` should be a path to a file that will be created for you. Likewise, if you want `stdout` written to a seperate file, you can supply the path to a file which will be created for logging `stdout`.
# Honorable-Mentions
This library is inspired by (but in no way affiliated with or endorsed by) the great folks and food at [The Standard Pour](http://www.standard-pour.com/).
