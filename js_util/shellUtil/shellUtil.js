const {exec, spawn} = require('child_process');

let _usage;

module.exports.setUsage = function (usage) {
    _usage = usage;
};

function mergeCmdOptions(options, extOptions) {
  if (extOptions) {
    if (extOptions.cwd) {
      options.cwd = extOptions.cwd;
    }
    if (extOptions.env) {
      // Default: process.env.
      options.env = Object.assign({}, process.env, extOptions.env);
    }
  }
  return options;
}

/**
 * No output, return cmd execution result.
 *
 * @param {string} cmdStr
 * @param {Object?} extOptions
 * @param {Object?} extOptions.cwd
 * @param {Object?} extOptions.env key-value pairs. Will merge with process.env.
 * @return {Promise<string>} exec result (stdout).
 */
module.exports.cmdInline = function (cmdStr, extOptions) {
  return new Promise((resolve, reject) => {
    const options = mergeCmdOptions({}, extOptions);

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
 * No output, return cmd execution result.
 *
 * @param {string} cmdStr
 * @param {Object?} extOptions
 * @param {Object?} extOptions.cwd
 * @param {Object?} extOptions.env key-value pairs. Will merge with process.env.
 * @return {string} exec result (stdout).
 */
module.exports.cmdInlineSync = function (cmdStr, extOptions) {
  const options = mergeCmdOptions({}, extOptions);

  console.log(`[cmd_exec_inline_sync]: ${cmdStr}`);
  const stdout = execSync(cmdStr, options);
  return stdout.toString();
};

/**
 * Output to stdio as normal.
 *
 * @param {string} cmdStr
 * @param {Object?} extOptions
 * @param {Object?} extOptions.cwd
 * @param {Object?} extOptions.env key-value pairs. Will merge with process.env.
 * @return {Promise<void>}
 */
module.exports.cmd = function (cmdStr, extOptions) {
  return new Promise((resolve, reject) => {
    const options = mergeCmdOptions({
      // Use `shell: true`, the input command string will be transformed to
      // args: ['bin/sh', '-c', 'ls -aLF']
      // (the same as `require('child_process').exec`)
      // Then we can input a single string command rather than an arg array.
      shell: true,
      // Keep color
      stdio: 'inherit'
    }, extOptions);

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

module.exports.expect = function (cond, msg) {
    if (!cond) {
        console.error(msg);
        console.log(_usage);
        process.exit(1);
    }
};
