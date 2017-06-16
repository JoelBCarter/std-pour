# std-pour
Promise-based subprocess execution that writes output in real-time.

# Usage
This is great for chaining commands using promises, but seeing the output in real-time.

```
const { enact } = require('std-pour');
enact('ping', ['8.8.8.8', '-c', '4']).then(code => console.log(`Error Code: ${code}`));
```

This module wraps [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) so should be drop-in replacement (function signature-compatable) for any code that is using it.

```
const { spawn } = require('child_process');
const { enact } = require('std-pour');
const options = {
    cwd: '/usr',
    env: process.env
};
const ls1 = spawn('ls', ['-al'], options);
const ls2 = enact('ls', ['-al'], options);
```

# Honorable-Mentions
This library is inspired by (but in no way affiliated with or endorsed by) the great folks and food at [The Standard Pour](http://www.standard-pour.com/).
