const {exec, spawn} = require('child_process');

/**
 * No output, return cmd execution result.
 *
 * @param {string} cmdStr
 * @param {Object?} extEnv key-value pairs.
 * @return {Promise<string>} exec result (stdout).
 */
module.exports.cmdInline = function (cmdStr, extEnv) {
    return new Promise((resolve, reject) => {
        const options = {};
        if (extEnv) {
            // Default: process.env.
            options.env = Object.assign({}, process.env, extEnv);
        }

        console.log(`[cmd_exec_inline]: ${cmdStr}`);
        exec(cmdStr, options, (error, stdout) => {
            if (error) {
                console.log(`[cmd_exec_failed] exit code: ${error.code}, signal: ${error.signal}`);
                reject(error);
            }
            resolve(`${stdout}`);
        });
    });
};

/**
 * Output to stdio as normal.
 *
 * @param {string} cmdStr
 * @param {Object?} extEnv key-value pairs.
 * @return {Promise<void>}
 */
module.exports.cmd = function (cmdStr, extEnv) {
    return new Promise((resolve, reject) => {
        const options = {
            // Use `shell: true`, the input command string will be transformed to
            // args: ['bin/sh', '-c', 'ls -aLF']
            // (the same as `require('child_process').exec`)
            // Then we can input a single string command rather than an arg array.
            shell: true,
            // Keep color
            stdio: 'inherit'
        };
        if (extEnv) {
            // Default: process.env.
            options.env = Object.assign({}, process.env, extEnv);
        }

        console.log(`[cmd_exec]: ${cmdStr}`);

        const args = cmdStr.split(/\s+/);
        const cmd = args.shift();
        const subProc = spawn(cmd, args, options);
        let lastError;

        subProc.on('error', (error) => {
            console.log(`[cmd_exec_failed] exit code: ${error.code}, signal: ${error.signal}`);
            console.log(`   error_message: ${error.message}`);
            lastError = error;
        });
        subProc.on('close', code => {
            (code === 0 && !lastError)
                ? resolve()
                : reject(lastError);
        });
    });
};
